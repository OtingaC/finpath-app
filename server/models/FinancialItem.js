const mongoose = require('mongoose');

const financialItemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['asset', 'liability'],
    required: true
  },
  category: {
    type: String,
    enum: [
      // Asset categories
      'cash_savings',
      'stocks_investments',
      'retirement_account',
      'business',
      'other_asset',
      // Liability categories
      'credit_card',
      'personal_loan',
      'car_loan',
      'student_loan',
      'other_liability'
    ],
    required: true
  },
  value: {
    type: Number,
    required: true,
    min: 0
  },
  monthlyImpact: {
    type: Number,
    default: 0,
    // Positive for income-generating assets, negative for debt payments
  },
  interestRate: {
    type: Number,
    default: 0,
    // For liabilities (debt interest rate)
  }
}, {
  timestamps: true
});

// Index for faster queries
financialItemSchema.index({ userId: 1 });

module.exports = mongoose.models.FinancialItem || mongoose.model('FinancialItem', financialItemSchema);