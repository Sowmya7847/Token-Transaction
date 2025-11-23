const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');

// Contact page
router.get('/', requireAuth, (req, res) => {
  res.render('contact/index', {
    title: 'Contact Us',
    user: req.user
  });
});

module.exports = router;

