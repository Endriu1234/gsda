const axios = require('axios');
const { getRedmineApiConfiguration, getRedmineAddress } = require('../redmine/tools/redmineConnectionTools');
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: process.env.CACHE_TTL, checkperiod: process.env.CACHE_TTL * 0.2, useClones: false });

async function getValue(key) {

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
        const result = await axios.get(getRedmineAddress('projects.json'), getRedmineApiConfiguration());
        return result.data.projects.sort((a, b) => a.name.localeCompare(b.name));
    },
    'redmine_trackers': async () => {
        const result = await axios.get(getRedmineAddress('trackers.json'), getRedmineApiConfiguration());
        return result.data.trackers.sort((a, b) => a.name.localeCompare(b.name));
    },
    'redmine_users': async () => {
        const result = await axios.get(getRedmineAddress('users.json'), getRedmineApiConfiguration());
        result.data.users.forEach(user => user.name = `${user.firstname} ${user.lastname}`);
        return result.data.users.sort((a, b) => a.name.localeCompare(b.name));
    },
    'redmine_custom_fields': async () => {
        const result = await axios.get(getRedmineAddress('custom_fields.json'), getRedmineApiConfiguration());
        return result.data.custom_fields;
    }
}


module.exports.getValue = getValue;

module.exports.clearCache = async () => {
    console.log('Clearing cache');
    cache.flushAll();
}