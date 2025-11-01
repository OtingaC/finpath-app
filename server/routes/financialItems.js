const express = require('express');
const router = express.Router();
const {
  getFinancialItems,
  getFinancialItemById,
  createFinancialItem,
  updateFinancialItem,
  deleteFinancialItem
} = require('../controllers/financialItemsController');
const { protect } = require('../middleware/auth');

// All routes require authentication

// GET all financial items for user
router.get('/', protect, getFinancialItems);

// GET single financial item
router.get('/:id', protect, getFinancialItemById);

// POST - Create new financial item
router.post('/', protect, createFinancialItem);

// PUT - Update financial item
router.put('/:id', protect, updateFinancialItem);

// DELETE financial item
router.delete('/:id', protect, deleteFinancialItem);

module.exports = router;