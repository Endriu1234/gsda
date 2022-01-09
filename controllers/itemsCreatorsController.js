const cacheValueProvider = require('../business/cache/cacheValueProvider');


module.exports.renderCreateCustomItem = async (req, res) => {

    let projects = await cacheValueProvider.getValue('redmine_projects');
    let trackers = await cacheValueProvider.getValue('redmine_trackers');
    let users = await cacheValueProvider.getValue('redmine_users');
    console.log(users);
    res.render('items_creators/createCustomItem', { projects, trackers, users });
};