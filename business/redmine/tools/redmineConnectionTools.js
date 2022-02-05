module.exports.getRedmineApiConfiguration = function getRedmineApiConfiguration() {
    const config = { 'X-Redmine-API-Key': process.env.REDMINE_API_KEY };
    return { headers: config };
};

module.exports.getRedmineAddress = function getRedmineAddress(endPoint) {

    if (endPoint)
        return `${process.env.REDMINE_ADDRESS}/${endPoint}`;

    return `${process.env.REDMINE_ADDRESS}/`;
};