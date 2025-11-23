const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/auth');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { createTransaction } = require('../controllers/transactionController');
const mongoose = require('mongoose');

// Admin dashboard
router.get('/', requireAdmin, async (req, res) => {
  try {
    // Get all users
    const users = await User.find({}).lean();
    const formattedUsers = users.map(user => ({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      balance: user.balance || 0,
      isAdmin: user.isAdmin || false
    }));

    // Get all transactions
    const transactions = await Transaction.find({})
      .sort({ timestamp: -1 })
      .limit(50)
      .lean();
    
    const formattedTransactions = transactions.map(tx => ({
      id: tx._id.toString(),
      userId: tx.userId.toString(),
      ...tx,
      timestamp: new Date(tx.timestamp)
    }));

    // Calculate total stats
    const totalUsers = formattedUsers.length;
    const totalBalance = formattedUsers.reduce((sum, user) => sum + (user.balance || 0), 0);
    const totalTransactions = await Transaction.countDocuments({});

    res.render('admin/index', {
      title: 'Admin Panel',
      user: req.user,
      users: formattedUsers,
      transactions: formattedTransactions,
      stats: {
        totalUsers,
        totalBalance,
        totalTransactions
      }
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.render('error', {
      title: 'Error',
      message: 'Failed to load admin panel'
    });
  }
});

// Reset user balance
router.post('/reset-balance', requireAdmin, async (req, res) => {
  try {
    const { userId, newBalance } = req.body;
    const balance = parseFloat(newBalance) || 0;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    await User.findByIdAndUpdate(userId, {
      balance: balance
    });

    // Create transaction record
    await createTransaction({
      userId: userId,
      type: 'admin_reset',
      amount: balance,
      description: 'Balance reset by admin',
      status: 'completed'
    });

    res.json({ success: true, message: 'Balance reset successfully' });
  } catch (error) {
    console.error('Reset balance error:', error);
    res.status(500).json({ error: 'Failed to reset balance' });
  }
});

// Distribute tokens to multiple users
router.post('/distribute', requireAdmin, async (req, res) => {
  try {
    const { userIds, amount } = req.body;
    const tokenAmount = parseFloat(amount);

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ error: 'User IDs array is required' });
    }

    if (!tokenAmount || isNaN(tokenAmount) || tokenAmount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const session = await mongoose.startSession();
    
    try {
      await session.withTransaction(async () => {
        for (const userId of userIds) {
          const user = await User.findById(userId).session(session);
          
          if (user) {
            await User.findByIdAndUpdate(userId, {
              $inc: { balance: tokenAmount }
            }, { session });

            // Create transaction record
            await createTransaction({
              userId: userId,
              type: 'admin_distribute',
              amount: tokenAmount,
              description: 'Tokens distributed by admin',
              status: 'completed'
            });
          }
        }
      });
    } finally {
      await session.endSession();
    }

    res.json({ success: true, message: `Tokens distributed to ${userIds.length} users` });
  } catch (error) {
    console.error('Distribute tokens error:', error);
    res.status(500).json({ error: 'Failed to distribute tokens' });
  }
});

module.exports = router;

