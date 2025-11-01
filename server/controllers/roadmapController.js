const Roadmap = require('../models/Roadmap');
const FinancialItem = require('../models/FinancialItem');
const Goal = require('../models/Goal');
const User = require('../models/user');
const { generateRoadmap } = require('../utils/roadmapGenerator');

// GET user's roadmap (generates if doesn't exist)
exports.getRoadmap = async (req, res) => {
  try {
    let roadmap = await Roadmap.findOne({ userId: req.user.id });

    if (!roadmap) {
      return res.status(404).json({ 
        message: 'No roadmap found. Generate one first by calling POST /api/roadmap/generate' 
      });
    }

    res.status(200).json({ roadmap });

  } catch (error) {
    console.error('Get roadmap error:', error);
    res.status(500).json({ message: 'Server error fetching roadmap' });
  }
};

// POST - Generate personalized roadmap based on user data
exports.generateUserRoadmap = async (req, res) => {
  try {
    // Get user profile
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get financial items
    const financialItems = await FinancialItem.find({ userId: req.user.id });

    // Calculate financial state
    const assets = financialItems.filter(item => item.type === 'asset');
    const liabilities = financialItems.filter(item => item.type === 'liability');

    const totalAssets = assets.reduce((sum, item) => sum + item.value, 0);
    const totalLiabilities = liabilities.reduce((sum, item) => sum + item.value, 0);
    const cashAssets = assets
      .filter(item => item.category === 'cash_savings')
      .reduce((sum, item) => sum + item.value, 0);
    const investmentAssets = assets
      .filter(item => ['stocks_investments', 'retirement_account'].includes(item.category))
      .reduce((sum, item) => sum + item.value, 0);
    const businessAssets = assets
      .filter(item => item.category === 'business')
      .reduce((sum, item) => sum + item.value, 0);
    const hasHighInterestDebt = liabilities.some(item => item.interestRate > 10);

    const financialState = {
      totalAssets,
      totalLiabilities,
      netWorth: totalAssets - totalLiabilities,
      cashAssets,
      investmentAssets,
      businessAssets,
      hasHighInterestDebt
    };

    // Get user goals
    const goals = await Goal.find({ userId: req.user.id }).sort({ priority: 1 });

    if (goals.length === 0) {
      return res.status(400).json({ 
        message: 'Please set at least one financial goal before generating a roadmap' 
      });
    }

    // Generate roadmap using algorithm
    const roadmapSteps = generateRoadmap(user, financialState, goals);

    // Save or update roadmap
    let roadmap = await Roadmap.findOne({ userId: req.user.id });

    if (roadmap) {
      roadmap.steps = roadmapSteps;
      roadmap.lastGenerated = Date.now();
      await roadmap.save();
    } else {
      roadmap = await Roadmap.create({
        userId: req.user.id,
        steps: roadmapSteps
      });
    }

    res.status(200).json({
      message: 'Roadmap generated successfully',
      roadmap,
      financialState
    });

  } catch (error) {
    console.error('Generate roadmap error:', error);
    res.status(500).json({ message: 'Server error generating roadmap' });
  }
};

// PUT - Update progress for a specific roadmap step
exports.updateStepProgress = async (req, res) => {
  try {
    const { progress } = req.body;
    const stepNumber = parseInt(req.params.stepNumber);

    if (progress < 0 || progress > 100) {
      return res.status(400).json({ message: 'Progress must be between 0 and 100' });
    }

    const roadmap = await Roadmap.findOne({ userId: req.user.id });

    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found' });
    }

    const step = roadmap.steps.find(s => s.stepNumber === stepNumber);

    if (!step) {
      return res.status(404).json({ message: 'Step not found' });
    }

    step.currentProgress = progress;
    step.isCompleted = progress === 100;

    await roadmap.save();

    res.status(200).json({
      message: 'Progress updated successfully',
      roadmap
    });

  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ message: 'Server error updating progress' });
  }
};

// DELETE roadmap (allows regeneration)
exports.deleteRoadmap = async (req, res) => {
  try {
    const roadmap = await Roadmap.findOne({ userId: req.user.id });

    if (!roadmap) {
      return res.status(404).json({ message: 'No roadmap to delete' });
    }

    await roadmap.deleteOne();

    res.status(200).json({ message: 'Roadmap deleted successfully' });

  } catch (error) {
    console.error('Delete roadmap error:', error);
    res.status(500).json({ message: 'Server error deleting roadmap' });
  }
};