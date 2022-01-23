const express = require('express');
const router = express.Router();
const itemsCreatorsController = require('../controllers/itemsCreatorsController');
const redmineItemValidator = require('../business/validation/redmine/redmineItemMiddlewareValidator');

const catchAsync = require('../utils/catchAsync');

router.route('/createcustomitem')
    .get(catchAsync(itemsCreatorsController.renderCreateCustomItem))
    .post(catchAsync(redmineItemValidator.validateRedmineItem), catchAsync(itemsCreatorsController.createCustomItem));

module.exports = router;