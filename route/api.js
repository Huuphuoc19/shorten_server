var express = require('express');
var router = express.Router();
var config = require('./config_route.js');

// route for shorten controller
router.use('/shorten', require(config.controller.shorten));
router.use('/statistic', require(config.controller.statistic));

module.exports = router;