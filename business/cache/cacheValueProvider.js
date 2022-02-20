const { getRedmineData } = require('../redmine/tools/redmineConnectionTools');
const softDevDataProvider = require('../softdev/softDevDataProvider');
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: process.env.CACHE_TTL, checkperiod: process.env.CACHE_TTL * 0.2, useClones: false });

module.exports.getValue = async (key) => {

    let value = cache.get(key);

    if (value === undefined) {
        let retriveDataFun = reqisteredCaches[key];

        if (retriveDataFun !== undefined) {
            value = await retriveDataFun();
            cache.set(key, value);
            console.log(`Retriving ${key} from source`);
        }
        else
            console.log(`Cannot find retrive function for ${key}`);
    }
    else
        console.log(`Retriving ${key} from cache`);

    return value;
}

const reqisteredCaches = {
    'redmine_projects': async () => {
        const result = await getRedmineData('projects.json', true);
        return result.projects.sort((a, b) => a.name.localeCompare(b.name));
    },
    'redmine_trackers': async () => {
        const result = await getRedmineData('trackers.json');
        return result.trackers.sort((a, b) => a.name.localeCompare(b.name));
    },
    'redmine_users': async () => {
        const result = await getRedmineData('users.json', true);
        result.users.forEach(user => user.name = `${user.firstname} ${user.lastname}`);
        return result.users.sort((a, b) => a.name.localeCompare(b.name));
    },
    'redmine_custom_fields': async () => {
        const result = await getRedmineData('custom_fields.json');
        return result.custom_fields;
    },
    'softdev_projects': async () => {
        const result = await softDevDataProvider.getVersions();
        return result.sort((a, b) => a.PRODUCT_VERSION_NAME.localeCompare(b.PRODUCT_VERSION_NAME));
    }
}

module.exports.clearCache = async () => {
    console.log('Clearing cache');
    cache.flushAll();
}