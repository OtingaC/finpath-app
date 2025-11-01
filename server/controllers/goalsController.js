const Goal = require('../models/Goal');

// GET all goals for logged-in user
exports.getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.id }).sort({ priority: 1 });

    res.status(200).json({
      goals,
      count: goals.length
    });

  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({ message: 'Server error fetching goals' });
  }
};

// POST - Create new goal
exports.createGoal = async (req, res) => {
  try {
    const { goalType, priority, timeline, targetAmount } = req.body;

    // Validation
    if (!goalType || !priority) {
      return res.status(400).json({ message: 'Please provide goalType and priority' });
    }

    const validGoalTypes = ['emergency_fund', 'debt_freedom', 'start_investing', 'start_business', 'retire_early', 'passive_income'];
    if (!validGoalTypes.includes(goalType)) {
      return res.status(400).json({ message: 'Invalid goal type' });
    }

    if (priority < 1 || priority > 3) {
      return res.status(400).json({ message: 'Priority must be between 1 and 3' });
    }

    // Check if user already has 3 goals
    const existingGoalsCount = await Goal.countDocuments({ userId: req.user.id });
    if (existingGoalsCount >= 3) {
      return res.status(400).json({ message: 'Maximum 3 goals allowed. Delete an existing goal first.' });
    }

    // Check for duplicate goal type
    const existingGoal = await Goal.findOne({ userId: req.user.id, goalType });
    if (existingGoal) {
      return res.status(400).json({ message: 'You already have this goal type' });
    }

    // Create goal
    const goal = await Goal.create({
      userId: req.user.id,
      goalType,
      priority,
      timeline: timeline || 'medium',
      targetAmount: targetAmount || 0
    });

    res.status(201).json({
      message: 'Goal created successfully',
      goal
    });

  } catch (error) {
    console.error('Create goal error:', error);
    res.status(500).json({ message: 'Server error creating goal' });
  }
};

// PUT - Update goal
exports.updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    // Check ownership
    if (goal.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this goal' });
    }

    // Update fields
    const { priority, timeline, status, targetAmount } = req.body;

    if (priority) goal.priority = priority;
    if (timeline) goal.timeline = timeline;
    if (status) goal.status = status;
    if (targetAmount !== undefined) goal.targetAmount = targetAmount;

    await goal.save();

    res.status(200).json({
      message: 'Goal updated successfully',
      goal
    });

  } catch (error) {
    console.error('Update goal error:', error);
    res.status(500).json({ message: 'Server error updating goal' });
  }
};

// DELETE goal
exports.deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    // Check ownership
    if (goal.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this goal' });
    }

    await goal.deleteOne();

    res.status(200).json({
      message: 'Goal deleted successfully'
    });

  } catch (error) {
    console.error('Delete goal error:', error);
    res.status(500).json({ message: 'Server error deleting goal' });
  }
};