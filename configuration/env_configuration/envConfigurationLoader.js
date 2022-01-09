module.exports.loadConfiguration = () => {
    if (process.env.NODE_ENV !== 'production')
        require('dotenv').config({ path: 'configuration/env_configuration/configurations/dev_config.cfg' });
    else
        require('dotenv').config({ path: 'configuration/env_configuration/configurations/prod_config.cfg' });
};

