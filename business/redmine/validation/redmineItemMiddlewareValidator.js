const cacheValueProvider = require('../../cache/cacheValueProvider');

module.exports.validateRedmineItem = async (req, res, next) => {

    if (!req.body.item) {
        req.flash('error', 'Cannot add Redmine Item. Item is missing.');
        return res.redirect(req.originalUrl);
    }

    const projects = await cacheValueProvider.getValue('redmine_projects');

    if (projects.filter(p => p.name === req.body.item.project).length == 0) {
        req.flash('error', 'Cannot add Redmine Item. Project is required.');
        return res.redirect(req.originalUrl);
    }

    const trackers = await cacheValueProvider.getValue('redmine_trackers');

    if (trackers.filter(t => t.id === parseInt(req.body.item.tracker_id)).length == 0) {
        req.flash('error', 'Cannot add Redmine Item. No tracker provided.');
        return res.redirect(req.originalUrl);
    }

    if (!req.body.item.subject || req.body.item.subject.length === 0)
        throw new ExpressError('No proper subject provided');

    if (!req.body.item.description || req.body.item.description === 0) {
        req.flash('error', 'Cannot add Redmine Item. Description is required.');
        return res.redirect(req.originalUrl);
    }

    if (req.body.item.assignee) {
        const users = await cacheValueProvider.getValue('redmine_users');

        if (users.filter(u => u.name === req.body.item.assignee).length == 0) {
            req.flash('error', 'Cannot add Redmine Item. Wrong assignee provided.');
            return res.redirect(req.originalUrl);
        }
    }

    if (req.body.item.cr) {
        if (!new RegExp("^CR-[A-Z]{3,4}-[\\d]{1,9}I[T|S]$").test(req.body.item.cr)) {
            req.flash('error', 'Cannot add Redmine Item. No proper CR provided.');
            return res.redirect(req.originalUrl);
        }
    }

    if (req.body.item.issue) {
        if (!new RegExp("^ISS-[A-Z]{3,4}-[\\d]{1,9}I[T|S]$").test(req.body.item.issue)) {
            req.flash('error', 'Cannot add Redmine Item. No proper Issue provided.');
            return res.redirect(req.originalUrl);
        }
    }

    if (req.body.item.tms) {

        if (!new RegExp("^[A-Z]{4,5}-[\\d]{1,9}$").test(req.body.item.tms)) {
            req.flash('error', 'Cannot add Redmine Item. No proper TMS provided.');
            return res.redirect(req.originalUrl);
        }
    }

    next();
}