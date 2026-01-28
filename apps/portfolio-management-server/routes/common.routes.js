const express = require('express');
const Project = require('../models/project.model');
const Technology = require('../models/technology.model');
const router = express.Router();

router.get('/get-counts', async (_req, res) => {
  try {
    // Get counts from database
    const projectCount = await Project.countDocuments();
    const technologyCount = await Technology.countDocuments();

    // Return the counts
    res.status(200).json({
      success: true,
      counts: {
        projects: projectCount,
        technologies: technologyCount
      }
    });
  } catch (error) {
    console.error('Error fetching counts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch counts',
      error: error.message
    });
  }
});
module.exports = router;