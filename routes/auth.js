const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { requireAuth } = require('../middleware/auth');

// Login page
router.get('/login', (req, res) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  res.render('auth/login', { title: 'Login', error: null });
});

// Register page
router.get('/register', (req, res) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  res.render('auth/register', { title: 'Register', error: null });
});

// Login handler
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.render('auth/login', {
        title: 'Login',
        error: 'Email and password are required'
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.render('auth/login', {
        title: 'Login',
        error: 'Invalid email or password'
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.render('auth/login', {
        title: 'Login',
        error: 'Invalid email or password'
      });
    }

    // Set session
    req.session.user = {
      uid: user._id.toString(),
      email: user.email,
      isAdmin: user.isAdmin || false
    };

    res.redirect('/dashboard');
  } catch (error) {
    console.error('Login error:', error);
    res.render('auth/login', {
      title: 'Login',
      error: 'An error occurred during login. Please try again.'
    });
  }
});

// Register handler
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password) {
      return res.render('auth/register', {
        title: 'Register',
        error: 'Email and password are required'
      });
    }

    if (password.length < 6) {
      return res.render('auth/register', {
        title: 'Register',
        error: 'Password must be at least 6 characters long'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    
    if (existingUser) {
      return res.render('auth/register', {
        title: 'Register',
        error: 'Email already exists. Please login instead.'
      });
    }

    // Create new user
    const user = new User({
      email: email.toLowerCase(),
      password: password,
      name: name || email,
      balance: 0,
      isAdmin: false
    });

    await user.save();

    // Set session
    req.session.user = {
      uid: user._id.toString(),
      email: user.email,
      isAdmin: false
    };

    res.redirect('/dashboard');
  } catch (error) {
    console.error('Register error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    
    let errorMessage = 'An error occurred during registration. Please try again.';
    
    if (error.code === 11000) {
      // MongoDB duplicate key error
      errorMessage = 'Email already exists. Please login instead.';
    } else if (error.name === 'ValidationError') {
      errorMessage = Object.values(error.errors).map(e => e.message).join(', ');
    }
    
    res.render('auth/register', {
      title: 'Register',
      error: errorMessage
    });
  }
});

// Logout handler
router.post('/logout', requireAuth, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/login');
  });
});

module.exports = router;

