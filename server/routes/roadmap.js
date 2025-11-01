const express = require('express');
const router = express.Router();
const {
  getRoadmap,
  generateUserRoadmap,
  updateStepProgress,
  deleteRoadmap
} = require('../controllers/roadmapController');
const { protect } = require('../middleware/auth');

console.log('Roadmap routes file loaded');
// All routes are protected

// GET /api/roadmap
router.get('/', protect, getRoadmap);

// POST /api/roadmap/generate
router.post('/generate', protect, generateUserRoadmap);

// PUT /api/roadmap/progress/:stepNumber
router.put('/progress/:stepNumber', protect, updateStepProgress);

// DELETE /api/roadmap
router.delete('/', protect, deleteRoadmap);

module.exports = router;