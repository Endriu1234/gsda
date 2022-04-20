const express = require('express');
const router = express.Router();
const projectsCreatorsController = require('../controllers/projectsCreatorsController');
const { isUserLogged } = require('../configuration/app_configuration/appSecurityConfigurationLoader');
const redmineProjectValidator = require('../business/redmine/validation/redmineProjectMiddlewareValidator');

const catchAsync = require('../utils/catchAsync');

router.route('/createproject')
    .get(isUserLogged, catchAsync(projectsCreatorsController.renderCreateProject))
    .post(isUserLogged, catchAsync(redmineProjectValidator.validateRedmineProject), catchAsync(projectsCreatorsController.createProject));

router.route('/createprojectfromsdproject')
    .get(isUserLogged, catchAsync(projectsCreatorsController.renderCreateProjectFromSDProject))
    .post(isUserLogged, catchAsync(projectsCreatorsController.renderCreateProject));

module.exports = router;