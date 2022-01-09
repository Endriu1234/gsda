const express = require('express');
const router = express.Router();
const itemsCreatorsController = require('../controllers/itemsCreatorsController');

const catchAsync = require('../utils/catchAsync');

router.get('/createcustomitem', catchAsync(itemsCreatorsController.renderCreateCustomItem));

module.exports = router;