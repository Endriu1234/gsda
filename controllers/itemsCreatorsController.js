const cacheValueProvider = require('../business/cache/cacheValueProvider');
const { convertFormItemObjectToJSON } = require('../business/redmine/tools/formItemObjectToJSONConverter');
const { postRedmineJsonData } = require('../business/redmine/tools/redmineConnectionTools');
const softDevDataProvider = require('../business/softdev/softDevDataProvider');
const RegressionViewDataPeparer = require('../business/redmine/data_preparing/RegressionViewDataPreparer');

module.exports.renderCreateItem = async (req, res) => {
    const projects = await cacheValueProvider.getValue('redmine_projects');
    const trackers = await cacheValueProvider.getValue('redmine_trackers');
    const users = await cacheValueProvider.getValue('redmine_users');

    res.render('items_creators/createItem', { projects, trackers, users, issue: req.body.issue });
};

module.exports.createItem = async (req, res) => {
    const itemJson = await convertFormItemObjectToJSON(req.body.item);
    let success = await postRedmineJsonData('issues.json', itemJson);

    if (success) {
        req.flash('success', 'Redmine Item created');
        return res.redirect(req.originalUrl);
    }
    else {
        req.flash('error', 'Redmine Item not created. Something went wrong');
        return res.redirect(req.originalUrl);
    }
};

module.exports.renderCreateItemsFromRegressions = async (req, res) => {
    const softDevProjects = await cacheValueProvider.getValue('softdev_projects');
    const redmineProjects = await cacheValueProvider.getValue('redmine_projects');
    let softDevIssues;

    if (req.body.searchData) {
        softDevIssues = await softDevDataProvider.getIssuesFromProject(req.body.searchData.softdevproject);
        const dataPreparer = new RegressionViewDataPeparer(softDevIssues, req.body.searchData.redmineproject);
        softDevIssues = await dataPreparer.prepare();
    }

    res.render('items_creators/createItemsFromRegressions', { softDevProjects, redmineProjects, searchData: req.body.searchData, softDevIssues });
};