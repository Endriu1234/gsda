const ExpressError = require('../../../utils/ExpressError');
const cacheValueProvider = require('../../cache/cacheValueProvider');


module.exports.validateRedmineItem = async (req, res, next) => {

    if (!req.body.item)
        throw new ExpressError('New item not provided');

    const projects = await cacheValueProvider.getValue('redmine_projects');

    if (projects.filter(p => p.name === req.body.item.project).length == 0)
        throw new ExpressError('No proper project provided');

    const trackers = await cacheValueProvider.getValue('redmine_trackers');

    if (trackers.filter(t => t.id === parseInt(req.body.item.tracker)).length == 0)
        throw new ExpressError('No proper tracker provided');

    if (!req.body.item.topic || req.body.item.topic.length === 0)
        throw new ExpressError('No proper topic provided');

    if (!req.body.item.description || req.body.item.topic.description === 0)
        throw new ExpressError('No proper description provided');

    if (req.body.item.assignee) {
        const users = await cacheValueProvider.getValue('redmine_users');

        if (users.filter(u => u.name === req.body.item.assignee).length == 0)
            throw new ExpressError('No proper user provided');
    }

    if (req.body.item.cr) {
        if (!new RegExp("^CR-[A-Z]{3,4}-[\\d]{1,9}I[T|S]$").test(req.body.item.cr))
            throw new ExpressError('No proper CR provided');
    }

    if (req.body.item.issue) {
        if (!new RegExp("^ISS-[A-Z]{3,4}-[\\d]{1,9}I[T|S]$").test(req.body.item.issue))
            throw new ExpressError('No proper Issue provided');
    }

    if (req.body.item.tms) {

        if (!new RegExp("^[A-Z]{4,5}-[\\d]{1,9}$").test(req.body.item.tms))
            throw new ExpressError('No proper TMS provided');
    }

    next();
}