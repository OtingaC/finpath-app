const express = require('express');
const router = express.Router();
const {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal
} = require('../controllers/goalsController');
const { protect } = require('../middleware/auth');

// All routes are protected

// GET /api/goals
router.get('/', protect, getGoals);

// POST /api/goals
router.post('/', protect, createGoal);

// PUT /api/goals/:id
router.put('/:id', protect, updateGoal);

// DELETE /api/goals/:id
router.delete('/:id', protect, deleteGoal);

module.exports = router;