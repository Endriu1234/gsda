require('./configuration/env_configuration/envConfigurationLoader').loadConfiguration();

const express = require('express');
const appConfiugrationLoader = require('./configuration/app_configuration/appConfigurationLoader');
const appRoutingLoader = require('./configuration/app_configuration/appRoutingLoader');

const app = express();
appConfiugrationLoader.loadAppConfiguration(app, __dirname);
appRoutingLoader.loadRouting(app);

app.listen(process.env.APP_PORT, () => {
    const currTime = new Date(Date.now());
    console.log(`${currTime.toLocaleString()}: Serving on port ${process.env.APP_PORT} with configuration ${process.env.CONFIGURATION_NAME} `);
});
