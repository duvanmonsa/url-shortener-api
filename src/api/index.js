const express = require('express');

// Controller
const ShortenerController = require('./ShortenerController');
const router = express.Router();

// Users
router
  .post('/', ShortenerController.parseUrls);

module.exports = router;
