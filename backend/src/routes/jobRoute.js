const express = require('express');
const router = express.Router();
const { getAllJobs } = require('../controllers/jobController');

// GET /api/v1/jobs - Get all jobs with their time requirements
router.get('/', getAllJobs);

module.exports = router; 