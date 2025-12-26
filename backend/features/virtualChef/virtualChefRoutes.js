const express = require('express');
const router = express.Router();
const { analyzeCookingState } = require('./virtualChefController');

// Define the route
// This matches POST /api/virtual-chef/analyze
router.post('/analyze', analyzeCookingState);

// CRITICAL: You must export the router like this
module.exports = router;