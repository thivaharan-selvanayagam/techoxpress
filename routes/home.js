const express = require('express');
const router = express.Router();
router.get('/', (req, res) => {
  res.render('home', { title: 'Techo Xpress — Speed. Precision. Delivered.', page: 'home' });
});
module.exports = router;