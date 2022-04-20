const cacheValueProvider = require('../cache/cacheValueProvider');
const oracledb = require('oracledb');
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

async function executeSoftDevQuery(query) {
    let connection;

    try {
        connection = await oracledb.getConnection({
            user: process.env.SOFTDEV_DB_USER,
            password: process.env.SOFTDEV_DB_PASS,
            connectString: `${process.env.SOFTDEV_DB_HOST}:${process.env.SOFT_DEV_DB_PORT}/${process.env.SOFT_DEV_DB_SID}`
        });

        const result = await connection.execute(query);
        return result.rows;

    } catch (err) {
        console.error(err);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}

module.exports.getVersions = async () => {

    return await executeSoftDevQuery(
        `SELECT 
            prd_version.aa_id AS product_version_id,
            prd_version.prv_version AS product_version_name, 
            proj.pj_svn_branch AS product_branch,
            proj.pj_release_candidate AS product_release_candidate,
            proj.pj_dev_start AS product_dev_start,
            proj.pj_dev_end AS product_dev_end,  
            proj.pj_test_start AS product_test_start,   
            proj.pj_test_end AS product_test_end, 
            proj.pj_delivery_date product_delivery_date, 
            (SELECT gus_user_firstname || ' ' || gus_user_lastname FROM sd_live.global_users WHERE aa_id = proj.pj_testing_mngr_aa) AS product_testing_mgr,
            (SELECT gus_user_firstname || ' ' || gus_user_lastname FROM sd_live.global_users WHERE aa_id = proj.pj_program_mngr_aa) AS product_programming_mgr,
            (SELECT gus_user_firstname || ' ' || gus_user_lastname FROM sd_live.global_users WHERE aa_id =  proj.pj_project_mngr_aa) AS product_project_mgr 
        FROM 
            sd_live.prod_version prd_version, sd_live.product product, sd_live.project proj
        WHERE 
            prd_version.prv_product_aa = product.aa_id
            AND product.prd_id = 'GENE'
            AND prd_version.prv_is_active = 'Y'
            AND proj.pj_version_aa = prd_version.aa_id
            AND proj.pj_status not in ('Canceled', 'Closed', 'Delivered', 'Doc Reviewed', 'Doc Created', 'Finished', 'Scope Approved')`);
};

module.exports.getRegressionsFromVersion = async (softDevProjectName) => {
    const softDevProjects = await cacheValueProvider.getValue('softdev_projects');
    const project = softDevProjects.find(p => p.PRODUCT_VERSION_NAME === softDevProjectName);

    if (project) {
        let query = `SELECT 
                aa_uf_id AS issue_id,
                iss_summary AS issue_summary,
                iss_desc AS issue_description,
                users.gus_user_id AS issue_registered_by
            FROM 
                sd_live.issue issue, 
                sd_live.issue_source source,
                sd_live.product product,
                sd_live.global_users users
            WHERE 
                issue.aa_id = source.isr_issue_aa
                AND issue.iss_product_aa = product.aa_id
                AND issue.iss_reg_by_aa = users.aa_id
                AND source.isr_source_type IN ('Autotesting', 'Acceptance Testing', 'Failed TC (regression)')
                AND product.prd_id = 'GENE'
                AND iss_is_active = 'Y' 
                AND iss_status <> 'Canceled'`;

        if (project.PRODUCT_VERSION_NAME.endsWith('_Packet')) {
            query += `AND iss_detection_version_aa IN(SELECT
                        prj.pj_version_aa
                    FROM 
                        sd_live.project prj, sd_live.project pckt, sd_live.project_link prjlnk
                    WHERE
                        prj.aa_id = prjlnk.pjl_project_aa
                        AND pckt.aa_id = prjlnk.pjl_parent_proj_aa
                        AND pckt.pj_version_aa = ${project.PRODUCT_VERSION_ID})`;
        }
        else
            query += `AND iss_detection_version_aa = ${project.PRODUCT_VERSION_ID}`;

        return await executeSoftDevQuery(query);
    }
}
