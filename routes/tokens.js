const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { requireAuth } = require('../middleware/auth');
const User = require('../models/User');
const { createTransaction } = require('../controllers/transactionController');

// Token management page
router.get('/', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.uid);
    
    res.render('tokens/index', {
      title: 'Token Management',
      user: {
        ...req.user,
        balance: user?.balance || 0
      }
    });
  } catch (error) {
    console.error('Token page error:', error);
    res.render('error', {
      title: 'Error',
      message: 'Failed to load token management page'
    });
  }
});

// Create tokens (Admin only)
router.post('/create', requireAuth, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { amount, userId } = req.body;
    const tokenAmount = parseFloat(amount);
    const targetUserId = userId || req.user.uid;

    if (isNaN(tokenAmount) || tokenAmount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Update user balance
    await User.findByIdAndUpdate(targetUserId, {
      $inc: { balance: tokenAmount }
    });

    // Create transaction record
    await createTransaction({
      userId: targetUserId,
      type: 'create',
      amount: tokenAmount,
      description: `Tokens created by admin`,
      status: 'completed'
    });

    res.json({ success: true, message: 'Tokens created successfully' });
  } catch (error) {
    console.error('Create tokens error:', error);
    res.status(500).json({ error: 'Failed to create tokens' });
  }
});

// Transfer tokens
router.post('/transfer', requireAuth, async (req, res) => {
  try {
    const { recipientEmail, amount, description } = req.body;
    const tokenAmount = parseFloat(amount);

    if (!recipientEmail || !tokenAmount || isNaN(tokenAmount) || tokenAmount <= 0) {
      return res.status(400).json({ error: 'Invalid recipient or amount' });
    }

    // Find recipient by email
    const recipient = await User.findOne({ email: recipientEmail.toLowerCase() });

    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    const recipientId = recipient._id.toString();

    if (recipientId === req.user.uid) {
      return res.status(400).json({ error: 'Cannot transfer to yourself' });
    }

    // Get sender
    const sender = await User.findById(req.user.uid);

    if (!sender) {
      return res.status(404).json({ error: 'Sender not found' });
    }

    if (sender.balance < tokenAmount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Perform transfer using MongoDB transaction
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        await User.findByIdAndUpdate(req.user.uid, {
          $inc: { balance: -tokenAmount }
        }, { session });

        await User.findByIdAndUpdate(recipientId, {
          $inc: { balance: tokenAmount }
        }, { session });
      });
    } finally {
      await session.endSession();
    }

    // Create transaction records for both users
    const txDescription = description || `Transfer to ${recipientEmail}`;
    
    await createTransaction({
      userId: req.user.uid,
      type: 'transfer',
      amount: -tokenAmount,
      description: `Sent to ${recipientEmail}`,
      status: 'completed',
      relatedUserId: recipientId
    });

    await createTransaction({
      userId: recipientId,
      type: 'transfer',
      amount: tokenAmount,
      description: `Received from ${req.user.email}`,
      status: 'completed',
      relatedUserId: req.user.uid
    });

    res.json({ success: true, message: 'Transfer completed successfully' });
  } catch (error) {
    console.error('Transfer error:', error);
    res.status(500).json({ error: error.message || 'Failed to transfer tokens' });
  }
});

// Burn tokens
router.post('/burn', requireAuth, async (req, res) => {
  try {
    const { amount } = req.body;
    const tokenAmount = parseFloat(amount);

    if (!tokenAmount || isNaN(tokenAmount) || tokenAmount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const user = await User.findById(req.user.uid);

    if (user.balance < tokenAmount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    await User.findByIdAndUpdate(req.user.uid, {
      $inc: { balance: -tokenAmount }
    });

    // Create transaction record
    await createTransaction({
      userId: req.user.uid,
      type: 'burn',
      amount: -tokenAmount,
      description: 'Tokens burned',
      status: 'completed'
    });

    res.json({ success: true, message: 'Tokens burned successfully' });
  } catch (error) {
    console.error('Burn tokens error:', error);
    res.status(500).json({ error: error.message || 'Failed to burn tokens' });
  }
});

// Deposit tokens
router.post('/deposit', requireAuth, async (req, res) => {
  try {
    const { amount } = req.body;
    const tokenAmount = parseFloat(amount);

    if (!tokenAmount || isNaN(tokenAmount) || tokenAmount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    await User.findByIdAndUpdate(req.user.uid, {
      $inc: { balance: tokenAmount }
    });

    // Create transaction record
    await createTransaction({
      userId: req.user.uid,
      type: 'deposit',
      amount: tokenAmount,
      description: 'Token deposit',
      status: 'completed'
    });

    res.json({ success: true, message: 'Deposit completed successfully' });
  } catch (error) {
    console.error('Deposit error:', error);
    res.status(500).json({ error: 'Failed to deposit tokens' });
  }
});

// Withdraw tokens
router.post('/withdraw', requireAuth, async (req, res) => {
  try {
    const { amount } = req.body;
    const tokenAmount = parseFloat(amount);

    if (!tokenAmount || isNaN(tokenAmount) || tokenAmount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const user = await User.findById(req.user.uid);

    if (user.balance < tokenAmount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    await User.findByIdAndUpdate(req.user.uid, {
      $inc: { balance: -tokenAmount }
    });

    // Create transaction record
    await createTransaction({
      userId: req.user.uid,
      type: 'withdraw',
      amount: -tokenAmount,
      description: 'Token withdrawal',
      status: 'completed'
    });

    res.json({ success: true, message: 'Withdrawal completed successfully' });
  } catch (error) {
    console.error('Withdraw error:', error);
    res.status(500).json({ error: error.message || 'Failed to withdraw tokens' });
  }
});

module.exports = router;

