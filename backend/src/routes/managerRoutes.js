const express = require('express');
const router = express.Router();
const managerController = require('../controllers/managerController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Manager routes here

module.exports = router;