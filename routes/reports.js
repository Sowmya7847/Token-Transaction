const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const Transaction = require('../models/Transaction');

// Reports page
router.get('/', requireAuth, async (req, res) => {
  try {
    // Get all transactions for the user
    const transactions = await Transaction.find({ userId: req.user.uid })
      .sort({ timestamp: -1 })
      .lean();
    
    // Format timestamps
    const formattedTransactions = transactions.map(tx => ({
      ...tx,
      timestamp: new Date(tx.timestamp)
    }));

    // Calculate statistics
    const stats = {
      totalTransactions: transactions.length,
      totalDeposits: 0,
      totalWithdrawals: 0,
      totalTransfers: 0,
      totalBurns: 0,
      netAmount: 0
    };

    transactions.forEach(tx => {
      const amount = Math.abs(tx.amount);
      stats.netAmount += tx.amount;
      
      switch (tx.type) {
        case 'deposit':
          stats.totalDeposits += amount;
          break;
        case 'withdraw':
          stats.totalWithdrawals += amount;
          break;
        case 'transfer':
          stats.totalTransfers += amount;
          break;
        case 'burn':
          stats.totalBurns += amount;
          break;
      }
    });

    // Group by date for chart
    const dailyData = {};
    formattedTransactions.forEach(tx => {
      const date = tx.timestamp.toISOString().split('T')[0];
      if (!dailyData[date]) {
        dailyData[date] = { deposits: 0, withdrawals: 0, transfers: 0, burns: 0 };
      }
      const amount = Math.abs(tx.amount);
      if (tx.amount > 0) {
        if (tx.type === 'deposit') dailyData[date].deposits += amount;
        if (tx.type === 'transfer') dailyData[date].transfers += amount;
      } else {
        if (tx.type === 'withdraw') dailyData[date].withdrawals += amount;
        if (tx.type === 'burn') dailyData[date].burns += amount;
        if (tx.type === 'transfer') dailyData[date].transfers += amount;
      }
    });

    res.render('reports/index', {
      title: 'Reports & Analytics',
      user: req.user,
      stats,
      dailyData: JSON.stringify(dailyData)
    });
  } catch (error) {
    console.error('Reports page error:', error);
    res.render('error', {
      title: 'Error',
      message: 'Failed to load reports'
    });
  }
});

module.exports = router;

