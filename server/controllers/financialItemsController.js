const FinancialItem = require('../models/FinancialItem');

// GET  all financial items for logged-in user
exports.getFinancialItems = async (req, res) => {
  try {
    const items = await FinancialItem.find({ userId: req.user.id }).sort({ createdAt: -1 });

    // Calculate totals
    const totalAssets = items
      .filter(item => item.type === 'asset')
      .reduce((sum, item) => sum + item.value, 0);

    const totalLiabilities = items
      .filter(item => item.type === 'liability')
      .reduce((sum, item) => sum + item.value, 0);

    const netWorth = totalAssets - totalLiabilities;

    // Check for high-interest debt (>10% interest rate)
    const hasHighInterestDebt = items.some(
      item => item.type === 'liability' && item.interestRate > 10
    );

    res.status(200).json({
      items,
      summary: {
        totalAssets,
        totalLiabilities,
        netWorth,
        assetToLiabilityRatio: totalLiabilities > 0 ? (totalAssets / totalLiabilities).toFixed(2) : 'N/A',
        hasHighInterestDebt,
        itemCount: items.length
      }
    });

  } catch (error) {
    console.error('Get financial items error:', error);
    res.status(500).json({ message: 'Server error fetching financial items' });
  }
};

// GET single financial item
exports.getFinancialItemById = async (req, res) => {
  try {
    const item = await FinancialItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Financial item not found' });
    }

    // Check ownership
    if (item.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to access this item' });
    }

    res.status(200).json({ item });

  } catch (error) {
    console.error('Get financial item error:', error);
    res.status(500).json({ message: 'Server error fetching financial item' });
  }
};

// POST - Create new financial item
exports.createFinancialItem = async (req, res) => {
  try {
    const { name, type, category, value, monthlyImpact, interestRate } = req.body;

    // Validation
    if (!name || !type || !category || value === undefined) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (!['asset', 'liability'].includes(type)) {
      return res.status(400).json({ message: 'Type must be either asset or liability' });
    }

    if (value < 0) {
      return res.status(400).json({ message: 'Value cannot be negative' });
    }

    // Create financial item
    const item = await FinancialItem.create({
      userId: req.user.id,
      name,
      type,
      category,
      value,
      monthlyImpact: monthlyImpact || 0,
      interestRate: interestRate || 0
    });

    res.status(201).json({
      message: 'Financial item created successfully',
      item
    });

  } catch (error) {
    console.error('Create financial item error:', error);
    res.status(500).json({ message: 'Server error creating financial item' });
  }
};

// PUT - Update financial item
exports.updateFinancialItem = async (req, res) => {
  try {
    const item = await FinancialItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Financial item not found' });
    }

    // Check ownership
    if (item.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this item' });
    }

    // Update fields
    const { name, type, category, value, monthlyImpact, interestRate } = req.body;

    if (name) item.name = name;
    if (type) item.type = type;
    if (category) item.category = category;
    if (value !== undefined) item.value = value;
    if (monthlyImpact !== undefined) item.monthlyImpact = monthlyImpact;
    if (interestRate !== undefined) item.interestRate = interestRate;

    await item.save();

    res.status(200).json({
      message: 'Financial item updated successfully',
      item
    });

  } catch (error) {
    console.error('Update financial item error:', error);
    res.status(500).json({ message: 'Server error updating financial item' });
  }
};

// DELETE financial item
exports.deleteFinancialItem = async (req, res) => {
  try {
    const item = await FinancialItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Financial item not found' });
    }

    // Check ownership
    if (item.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this item' });
    }

    await item.deleteOne();

    res.status(200).json({
      message: 'Financial item deleted successfully'
    });

  } catch (error) {
    console.error('Delete financial item error:', error);
    res.status(500).json({ message: 'Server error deleting financial item' });
  }
};