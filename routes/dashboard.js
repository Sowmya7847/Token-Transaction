const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// Dashboard page
router.get('/', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.uid);
    
    // Get all transactions for stats
    const allTransactions = await Transaction.find({ userId: req.user.uid })
      .sort({ timestamp: -1 })
      .lean();

    // Get recent transactions
    const recentTransactions = allTransactions.slice(0, 5);

    // Calculate statistics
    const stats = {
      totalTransactions: allTransactions.length,
      totalDeposits: 0,
      totalWithdrawals: 0,
      totalTransfers: 0,
      totalBurns: 0,
      netAmount: 0
    };

    allTransactions.forEach(tx => {
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

    // Group by date for chart (last 7 days)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      last7Days.push(date.toISOString().split('T')[0]);
    }

    const dailyData = {};
    last7Days.forEach(date => {
      dailyData[date] = { deposits: 0, withdrawals: 0, transfers: 0, burns: 0 };
    });

    allTransactions.forEach(tx => {
      const date = tx.timestamp.toISOString().split('T')[0];
      if (dailyData[date]) {
        const amount = Math.abs(tx.amount);
        if (tx.type === 'deposit' && tx.amount > 0) {
          dailyData[date].deposits += amount;
        } else if (tx.type === 'withdraw' && tx.amount < 0) {
          dailyData[date].withdrawals += amount;
        } else if (tx.type === 'transfer') {
          dailyData[date].transfers += amount;
        } else if (tx.type === 'burn' && tx.amount < 0) {
          dailyData[date].burns += amount;
        }
      }
    });

    // Transaction type distribution for pie chart
    const typeDistribution = {
      deposit: stats.totalDeposits,
      withdrawal: stats.totalWithdrawals,
      transfer: stats.totalTransfers,
      burn: stats.totalBurns
    };

    res.render('dashboard/index', {
      title: 'Dashboard',
      user: {
        ...req.user,
        balance: user?.balance || 0
      },
      recentTransactions: recentTransactions.map(tx => ({
        ...tx,
        timestamp: new Date(tx.timestamp)
      })),
      stats,
      dailyData: JSON.stringify(dailyData),
      typeDistribution: JSON.stringify(typeDistribution)
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.render('error', {
      title: 'Error',
      message: 'Failed to load dashboard'
    });
  }
});

module.exports = router;

