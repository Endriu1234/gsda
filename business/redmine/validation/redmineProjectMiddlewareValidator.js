const cacheValueProvider = require('../../cache/cacheValueProvider');

module.exports.validateRedmineProject = async (req, res, next) => {

    if (!req.body.project) {
        req.flash('error', 'Cannot add Redmine Project. Project is missing.');
        return res.redirect(req.originalUrl);
    }

    if (!req.body.project.name || req.body.project.name === 0) {
        req.flash('error', 'Cannot add Redmine Project. Name is required.');
        return res.redirect(req.originalUrl);
    }

    if (!req.body.project.description || req.body.project.description === 0) {
        req.flash('error', 'Cannot add Redmine Project. Description is required.');
        return res.redirect(req.originalUrl);
    }

    const projects = await cacheValueProvider.getValue('redmine_projects');

    if (req.body.project.parent_project && projects.filter(p => p.name === req.body.project.parent_project).length == 0) {
        req.flash('error', 'Cannot add Redmine Project. Parent Project is incorrect.');
        return res.redirect(req.originalUrl);
    }

    if (req.body.project.identifier) {
        if (!new RegExp("^[_\\-0-9a-z]{1,100}$").test(req.body.project.identifier)) {
            req.flash('error', 'Cannot add Redmine Project. No proper Identifier provided.');
            return res.redirect(req.originalUrl);
        }
    }

    next();
}