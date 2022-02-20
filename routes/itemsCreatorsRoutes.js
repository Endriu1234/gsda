const express = require('express');
const router = express.Router();
const itemsCreatorsController = require('../controllers/itemsCreatorsController');
const redmineItemValidator = require('../business/redmine/validation/redmineItemMiddlewareValidator');
const createitemsfromregressionsValidator = require('../business/common/validation/createItemsFromRegressionsMiddlewareValidator');

const catchAsync = require('../utils/catchAsync');

router.route('/createcustomitem')
    .get(catchAsync(itemsCreatorsController.renderCreateCustomItem))
    .post(catchAsync(redmineItemValidator.validateRedmineItem), catchAsync(itemsCreatorsController.createCustomItem));

router.route('/createitemsfromregressions')
    .get(catchAsync(itemsCreatorsController.renderCreateItemsFromRegressions))
    .post(catchAsync(createitemsfromregressionsValidator.validateCreateItemsFromRegressionsForm), catchAsync(itemsCreatorsController.renderCreateItemsFromRegressions));

module.exports = router;