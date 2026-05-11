const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('contact', { title: 'Contact — Techo Xpress', page: 'contact', success: false, error: null });
});

router.post('/', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.render('contact', { title: 'Contact — Techo Xpress', page: 'contact', success: false, error: 'Please fill in all required fields.' });
  }
  console.log('Contact:', req.body);
  res.render('contact', { title: 'Contact — Techo Xpress', page: 'contact', success: true, error: null });
});

module.exports = router;