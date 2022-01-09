const cacheValueProvider = require('../business/cache/cacheValueProvider');

module.exports.renderCache = async (req, res) => {
    res.render('setup/cache');
};

module.exports.clearCache = async (req, res) => {
    await cacheValueProvider.clearCache();
    req.flash('success', 'Cache cleared!');
    res.redirect('/setup/cache');
};