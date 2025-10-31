const mongoose = require('mongoose');

const roadmapStepSchema = new mongoose.Schema({
  stepNumber: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['foundation', 'wealth-building', 'advanced', 'preparation'],
    required: true
  },
  priority: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  canRunParallel: {
    type: Boolean,
    default: false
  },
  targetAmount: {
    type: Number,
    min: 0
    // Specific monetary target for this step
  },
  currentProgress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
    // Percentage completion (0-100)
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  reasoning: {
    type: String
    // Why this step is important for the user
  }
}, { _id: false });

const roadmapSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  steps: [roadmapStepSchema],
  lastGenerated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
roadmapSchema.index({ userId: 1 });

module.exports = mongoose.models.Roadmap || mongoose.model('Roadmap', roadmapSchema);