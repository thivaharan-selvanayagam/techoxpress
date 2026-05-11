const express = require('express');
const router = express.Router();
router.get('/', (req, res) => {
  res.render('services', { title: 'Services — Techo Xpress', page: 'services' });
});
module.exports = router;