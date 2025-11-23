const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const Transaction = require('../models/Transaction');

// Transactions page
router.get('/', requireAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    // Get transactions
    const transactions = await Transaction.find({ userId: req.user.uid })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Format timestamps
    const formattedTransactions = transactions.map(tx => ({
      ...tx,
      id: tx._id.toString(),
      timestamp: new Date(tx.timestamp)
    }));

    // Get total count for pagination
    const totalTransactions = await Transaction.countDocuments({ userId: req.user.uid });
    const totalPages = Math.ceil(totalTransactions / limit);

    res.render('transactions/index', {
      title: 'Transaction History',
      transactions: formattedTransactions,
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    });
  } catch (error) {
    console.error('Transactions page error:', error);
    res.render('error', {
      title: 'Error',
      message: 'Failed to load transactions'
    });
  }
});

module.exports = router;

