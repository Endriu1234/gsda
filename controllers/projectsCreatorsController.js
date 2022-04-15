const cacheValueProvider = require('../business/cache/cacheValueProvider');
const { postRedmineJsonData, putRedmineJsonData } = require('../business/redmine/tools/redmineConnectionTools');
const { convertFormProjectObjectToJSON } = require('../business/redmine/tools/formProjectObjectToJSONConverter');
const { convertFormProjectWikiObjectToJSON } = require('../business/redmine/tools/formProjectWikiObjectToJSONConverter');

module.exports.renderCreateProject = async (req, res) => {
    const projects = await cacheValueProvider.getValue('redmine_projects');

    res.render('projects_creators/createProject', { projects });
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

            if (success) {
                req.flash('success', 'Redmine Project created');
                return res.redirect(req.originalUrl);
            }
            else {
                req.flash('error', 'Redmine Project was created but without wiki. Something went wrong');
                return res.redirect(req.originalUrl);
            }
        }
        else {
            req.flash('success', 'Redmine Project created');
            return res.redirect(req.originalUrl);
        }
    }
    else {
        req.flash('error', 'Redmine Project not created. Something went wrong');
        return res.redirect(req.originalUrl);
    }
};