const express = require('express');
const router = express.Router();
const setupController = require('../controllers/setupController');
const { isUserLogged } = require('../configuration/app_configuration/appSecurityConfigurationLoader');

const catchAsync = require('../utils/catchAsync');

router.get('/cache', isUserLogged, catchAsync(setupController.renderCache));
router.post('/clearcache', catchAsync(setupController.clearCache))

module.exports = router;