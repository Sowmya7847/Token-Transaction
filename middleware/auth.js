const User = require('../models/User');

// Check if user is authenticated
const requireAuth = async (req, res, next) => {
  if (!req.session.user || !req.session.user.uid) {
    return res.redirect('/login');
  }
  
  try {
    // Verify user still exists in database
    const user = await User.findById(req.session.user.uid);
    
    if (!user) {
      req.session.destroy();
      return res.redirect('/login?error=user_not_found');
    }
    
    req.user = {
      uid: user._id.toString(),
      email: user.email,
      isAdmin: user.isAdmin || false,
      balance: user.balance || 0,
      name: user.name
    };
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    req.session.destroy();
    res.redirect('/login?error=auth_error');
  }
};

// Check if user is admin
const requireAdmin = async (req, res, next) => {
  if (!req.session.user || !req.session.user.uid) {
    return res.redirect('/login');
  }
  
  try {
    const user = await User.findById(req.session.user.uid);
    
    if (!user) {
      req.session.destroy();
      return res.redirect('/login?error=user_not_found');
    }
    
    if (!user.isAdmin) {
      return res.status(403).render('error', {
        title: 'Access Denied',
        message: 'You do not have permission to access this page.'
      });
    }
    
    req.user = {
      uid: user._id.toString(),
      email: user.email,
      isAdmin: true,
      balance: user.balance || 0,
      name: user.name
    };
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.redirect('/login?error=auth_error');
  }
};

module.exports = { requireAuth, requireAdmin };

