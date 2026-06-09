const express = require('express');
const router = express.Router();

// GET: Render Login Screen
router.get('/login', (req, res) => {
  res.render('login', { title: 'Staff Authentication — Techo Xpress', page: 'login', error: null });
});

// POST: Validate Credentials
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'admin' && password === 'techo123') {
    req.session.isLoggedIn = true;
    req.session.user = username;
    
    // ── 🔒 FORCE SYNCHRONOUS DATABASE WRITE BEFORE REDIRECTING ──
    return req.session.save((err) => {
      if (err) console.error('Session ledger write delay:', err);
      res.redirect('/dispatch'); // Safely redirect only after the token is secure
    });
    
  } else {
    return res.render('login', { 
      title: 'Staff Authentication — Techo Xpress', 
      page: 'login', 
      error: 'Access Denied: Invalid staff security key signatures.' 
    });
  }
});

// GET: Clear Session and Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;