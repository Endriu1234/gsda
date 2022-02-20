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
            prd_version.prv_version AS product_version_name
        FROM 
            sd_live.prod_version prd_version, sd_live.product product
        WHERE 
            prd_version.prv_product_aa = product.aa_id
            AND product.prd_id = 'GENE'
            AND prd_version.prv_is_active = 'Y'`);
};

module.exports.getIssuesFromProject = async (softDevProjectName) => {
    const softDevProjects = await cacheValueProvider.getValue('softdev_projects');
    const project = softDevProjects.find(p => p.PRODUCT_VERSION_NAME === softDevProjectName);

    if (project) {
        return await executeSoftDevQuery(
            `SELECT 
                aa_uf_id AS issue_id,
                iss_summary AS issue_summary,
                iss_desc AS issue_description,
                sd_live.get_open_assigned_act(3, issue.AA_ID) AS issue_assigned_to,
                users.gus_user_id AS issue_registered_by
            FROM 
                sd_live.issue issue, 
                sd_live.global_users users
            WHERE 
                issue.iss_reg_by_aa = users.aa_id
                AND iss_is_active = 'Y' 
                AND iss_status <> 'Canceled'
                AND iss_detection_version_aa = ${project.PRODUCT_VERSION_ID}`);
    }
}