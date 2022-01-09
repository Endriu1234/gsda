const express = require('express');
const router = express.Router();
const setupController = require('../controllers/setupController');

const catchAsync = require('../utils/catchAsync');


router.get('/cache', catchAsync(setupController.renderCache));
router.post('/clearcache', catchAsync(setupController.clearCache))

module.exports = router;