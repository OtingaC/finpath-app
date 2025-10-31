const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  profile: {
    age: {
      type: Number,
      min: 13,
      max: 120
    },
    employmentStatus: {
      type: String,
      enum: ['student', 'employed', 'entrepreneur', 'other'],
      default: 'other'
    },
    monthlyIncome: {
      type: Number,
      default: 0,
      min: 0
    },
    hasCompletedOnboarding: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);