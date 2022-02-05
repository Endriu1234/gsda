const axios = require('axios');
const cacheValueProvider = require('../business/cache/cacheValueProvider');
const { convertFormItemObjectToJSON } = require('../business/redmine/posting/formItemObjectToJSONConverter');
const { getRedmineApiConfiguration, getRedmineAddress } = require('../business/redmine/tools/redmineConnectionTools');

module.exports.renderCreateCustomItem = async (req, res) => {

    const projects = await cacheValueProvider.getValue('redmine_projects');
    const trackers = await cacheValueProvider.getValue('redmine_trackers');
    const users = await cacheValueProvider.getValue('redmine_users');

    res.render('items_creators/createCustomItem', { projects, trackers, users });
};

module.exports.createCustomItem = async (req, res) => {
    const itemJson = await convertFormItemObjectToJSON(req.body.item);
    const headersObject = getRedmineApiConfiguration();
    headersObject.headers['Content-Type'] = 'application/json';

    let success = true;

    const creationResult = await axios.post(getRedmineAddress('issues.json'), itemJson, headersObject).catch(function (error) {

        if (error.response) {
            // Request made and server responded
            success = false;
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        } else if (error.request) {
            // The request was made but no response was received
            success = false;
            console.log(error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            success = false;
            console.log('Error', error.message);
        }

    });

    if (success) {
        req.flash('success', 'Redmine Item created');
        res.redirect('/itemscreators/createcustomitem');
    }
    else {
        req.flash('error', 'Redmine Item not created. Something went wrong');
        res.redirect('/itemscreators/createcustomitem');
    }
};