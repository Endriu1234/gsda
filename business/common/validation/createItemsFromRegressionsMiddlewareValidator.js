const cacheValueProvider = require('../../cache/cacheValueProvider');

module.exports.validateCreateItemsFromRegressionsForm = async (req, res, next) => {

    if (!req.body.searchData) {

        req.flash('error', 'Cannot search for regressions. Criteria are missing.');
        return res.redirect(req.originalUrl);
    }

    const redmineProjects = await cacheValueProvider.getValue('redmine_projects');

    if (redmineProjects.filter(p => p.name === req.body.searchData.redmineproject).length == 0) {
        req.flash('error', 'Cannot search for regressions. Redmine project is required.');
        return res.redirect(req.originalUrl);
    }

    const softDevProjects = await cacheValueProvider.getValue('softdev_projects');

    if (softDevProjects.filter(p => p.PRODUCT_VERSION_NAME === req.body.searchData.softdevproject).length == 0) {
        req.flash('error', 'Cannot search for regressions. SoftDev project is required.');
        return res.redirect(req.originalUrl);
    }


    next();
}
