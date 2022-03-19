const cacheValueProvider = require('../business/cache/cacheValueProvider');
const { convertFormItemObjectToJSON } = require('../business/redmine/tools/formItemObjectToJSONConverter');
const { postRedmineJsonData } = require('../business/redmine/tools/redmineConnectionTools');
const softDevDataProvider = require('../business/softdev/softDevDataProvider');
const RegressionViewDataPeparer = require('../business/redmine/data_preparing/RegressionViewDataPreparer');

module.exports.renderCreateItem = async (req, res) => {
    const projects = await cacheValueProvider.getValue('redmine_projects');
    const trackers = await cacheValueProvider.getValue('redmine_trackers');
    const users = await cacheValueProvider.getValue('redmine_users');

    res.render('items_creators/createItem', { projects, trackers, users, issue: req.body.issue, additionalinfo: req.body.additionalinfo });
};

module.exports.createItem = async (req, res) => {
    const itemJson = await convertFormItemObjectToJSON(req.body.item);
    let success = await postRedmineJsonData('issues.json', itemJson);

    if (success) {
        if (req.body.additionalinfo && req.body.additionalinfo.source === 'regressions') {

            req.body.searchData = {
                softdevproject: req.body.additionalinfo.softdevproject,
                redmineproject: req.body.item.project,
                displaycreated: req.body.additionalinfo.displaycreated
            };

            return await renderCreateItemsFromRegressions(req, res);
        }

        req.flash('success', 'Redmine Item created');
        return res.redirect(req.originalUrl);
    }
    else {
        req.flash('error', 'Redmine Item not created. Something went wrong');
        return res.redirect(req.originalUrl);
    }
};

async function renderCreateItemsFromRegressions(req, res) {
    const softDevProjects = await cacheValueProvider.getValue('softdev_projects');
    const redmineProjects = await cacheValueProvider.getValue('redmine_projects');
    let softDevIssues;
    let regressionsDefaultSoftDevProject;
    let regressionsDefaultRedmineProject;
    let regressionsDefaultDisplayCreated;

    if (req.body.searchData) {
        softDevIssues = await softDevDataProvider.getRegressionsFromProject(req.body.searchData.softdevproject);
        const dataPreparer = new RegressionViewDataPeparer(softDevIssues, req.body.searchData.redmineproject, req.body.searchData.displaycreated);
        res.cookie('regressionsDefaultSoftDevProject', req.body.searchData.softdevproject, { signed: true });
        res.cookie('regressionsDefaultRedmineProject', req.body.searchData.redmineproject, { signed: true });
        res.cookie('regressionsDefaultDisplayCreated', req.body.searchData.displaycreated, { signed: true });
        softDevIssues = await dataPreparer.prepare();
    }
    else {
        if (req.signedCookies.regressionsDefaultSoftDevProject)
            regressionsDefaultSoftDevProject = req.signedCookies.regressionsDefaultSoftDevProject;

        if (req.signedCookies.regressionsDefaultRedmineProject)
            regressionsDefaultRedmineProject = req.signedCookies.regressionsDefaultRedmineProject;

        if (req.signedCookies.regressionsDefaultDisplayCreated)
            regressionsDefaultDisplayCreated = req.signedCookies.regressionsDefaultDisplayCreated;
    }

    res.render('items_creators/createItemsFromRegressions', {
        softDevProjects, redmineProjects, searchData: req.body.searchData, softDevIssues,
        regressionsDefaultSoftDevProject, regressionsDefaultRedmineProject, regressionsDefaultDisplayCreated
    });
}

module.exports.renderCreateItemsFromRegressions = renderCreateItemsFromRegressions;