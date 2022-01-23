const axios = require('axios');
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
        let config = { 'X-Redmine-API-Key': process.env.REDMINE_API_KEY };
        const result = await axios.get(`${process.env.REDMINE_ADDRESS}/projects.json`, { headers: config });
        return result.data.projects.sort((a, b) => a.name.localeCompare(b.name));
    },
    'redmine_trackers': async () => {
        let config = { 'X-Redmine-API-Key': process.env.REDMINE_API_KEY };
        const result = await axios.get(`${process.env.REDMINE_ADDRESS}/trackers.json`, { headers: config });
        return result.data.trackers.sort((a, b) => a.name.localeCompare(b.name));
    },
    'redmine_projects_memberships': async () => {
        let memberships = [];
        let config = { 'X-Redmine-API-Key': process.env.REDMINE_API_KEY };
        let projects = await getValue('redmine_projects');

        for (project of projects) {
            let memberships_result = await axios.get(`${process.env.REDMINE_ADDRESS}/projects/${project.id}/memberships.json`, { headers: config });
            memberships.push(...memberships_result.data.memberships);
        }

        return memberships;
    },
    'redmine_users': async () => {
        let uniqueUsersId = new Set();
        let memberships = await getValue('redmine_projects_memberships');

        let users = [];

        memberships.forEach(membership => {

            let user = membership.user;

            if (user !== undefined) {
                if (!uniqueUsersId.has(user.id)) {
                    uniqueUsersId.add(user.id);
                    users.push(membership.user);
                }
            }
        });

        return users.sort((a, b) => a.name.localeCompare(b.name));
    }
}


module.exports.getValue = getValue;

module.exports.clearCache = async () => {
    console.log('Clearing cache');
    cache.flushAll();
}