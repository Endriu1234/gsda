const cacheValueProvider = require('../business/cache/cacheValueProvider');


module.exports.renderCreateCustomItem = async (req, res) => {

    const projects = await cacheValueProvider.getValue('redmine_projects');
    const trackers = await cacheValueProvider.getValue('redmine_trackers');
    const users = await cacheValueProvider.getValue('redmine_users');

    res.render('items_creators/createCustomItem', { projects, trackers, users });
};

module.exports.createCustomItem = async (req, res) => {
    console.log('CREEATEcUSTOMitem');


};