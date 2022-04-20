const cacheValueProvider = require('../business/cache/cacheValueProvider');
const { postRedmineJsonData, putRedmineJsonData } = require('../business/redmine/tools/redmineConnectionTools');
const { convertFormProjectObjectToJSON } = require('../business/redmine/tools/formProjectObjectToJSONConverter');
const { convertFormProjectWikiObjectToJSON } = require('../business/redmine/tools/formProjectWikiObjectToJSONConverter');
const { getRedmineAddress } = require('../business/redmine/tools/redmineConnectionTools');


module.exports.renderCreateProject = async (req, res) => {
    const projects = await cacheValueProvider.getValue('redmine_projects');
    const softDevProjects = await cacheValueProvider.getValue('softdev_projects');
    const sd_project = req.body.softdevproject ? softDevProjects.find(p => p.PRODUCT_VERSION_NAME === req.body.softdevproject) : undefined;

    res.render('projects_creators/createProject', { projects, sd_project });
};

module.exports.createProject = async (req, res) => {
    const projectJson = await convertFormProjectObjectToJSON(req.body.project);
    let success = await postRedmineJsonData('projects.json', projectJson);


    if (success) {
        cacheValueProvider.deleteValue('redmine_projects');

        if (req.body.project.wiki) {
            const wikiJson = await convertFormProjectWikiObjectToJSON(req.body.project);
            let endpoint = `projects/${req.body.project.identifier}/wiki/Wiki.json`;
            success = await putRedmineJsonData(endpoint, wikiJson);

            if (success)
                req.flash('success', 'Redmine Project created');
            else
                req.flash('error', 'Redmine Project was created but without wiki. Something went wrong');
        }
        else
            req.flash('success', 'Redmine Project created');

        if (success && req.body.project.open_after_creation === 'true')
            return res.redirect(`${getRedmineAddress(`projects/${req.body.project.identifier}`)}`);

        return res.redirect(req.originalUrl);
    }
    else {
        req.flash('error', 'Redmine Project not created. Something went wrong');
        return res.redirect(req.originalUrl);
    }
};

module.exports.renderCreateProjectFromSDProject = async (req, res) => {
    let softDevProjects = await cacheValueProvider.getValue('softdev_projects');
    softDevProjects = softDevProjects.filter(p => !p.PRODUCT_VERSION_NAME.endsWith("Packet"));
    res.render('projects_creators/createProjectFromSDProject', { softDevProjects });
};