const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  goalType: {
    type: String,
    enum: [
      'emergency_fund',
      'debt_freedom',
      'start_investing',
      'start_business',
      'retire_early',
      'passive_income'
    ],
    required: true
  },
  priority: {
    type: Number,
    min: 1,
    max: 3,
    required: true
    // 1 = highest priority, 3 = lowest
  },
  timeline: {
    type: String,
    enum: ['short', 'medium', 'long'],
    default: 'medium'
    // short: 0-2 years, medium: 2-5 years, long: 5+ years
  },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed'],
    default: 'not_started'
  },
  targetAmount: {
    type: Number,
    min: 0
    // Optional: specific monetary target for the goal
  }
}, {
  timestamps: true
});

// Index for faster queries
goalSchema.index({ userId: 1 });

// Ensure user can't have duplicate goals
goalSchema.index({ userId: 1, goalType: 1 }, { unique: true });

module.exports = mongoose.models.Goal || mongoose.model('Goal', goalSchema);