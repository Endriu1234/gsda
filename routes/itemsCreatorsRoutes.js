const express = require('express');
const router = express.Router();
const itemsCreatorsController = require('../controllers/itemsCreatorsController');
const redmineItemValidator = require('../business/redmine/validation/redmineItemMiddlewareValidator');
const createitemsfromregressionsValidator = require('../business/common/validation/createItemsFromRegressionsMiddlewareValidator');
const { isUserLogged } = require('../configuration/app_configuration/appSecurityConfigurationLoader');

const catchAsync = require('../utils/catchAsync');

router.route('/createitem')
    .get(isUserLogged, catchAsync(itemsCreatorsController.renderCreateItem))
    .post(isUserLogged, catchAsync(redmineItemValidator.validateRedmineItem), catchAsync(itemsCreatorsController.createItem));

router.route('/createitemfromregression').post(catchAsync(itemsCreatorsController.renderCreateItem));

router.route('/createitemsfromregressions')
    .get(isUserLogged, catchAsync(itemsCreatorsController.renderCreateItemsFromRegressions))
    .post(catchAsync(createitemsfromregressionsValidator.validateCreateItemsFromRegressionsForm),
        catchAsync(itemsCreatorsController.renderCreateItemsFromRegressions));

module.exports = router;