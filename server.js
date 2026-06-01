const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment configurations

const app = express();

// ── SERVERLESS CONNECTION OPTIMIZATION ──
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return; 
  }
  console.log('💾 Initializing fresh cloud database connection uplink...');
  return mongoose.connect(process.env.MONGODB_URI);
};

// Global interceptor middleware to verify database connection before handling routes
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('🔴 Database connection critical failure during execution:', err);
    res.status(500).send('Logistics Engine Connection Timeout.');
  }
});

// ── MIDDLEWARE SETTINGS ──
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ── SYSTEM ROUTING CHANNELS ──
app.use('/',         require('./routes/home'));
app.use('/services', require('./routes/services'));
app.use('/tracking', require('./routes/tracking'));
app.use('/about',    require('./routes/about'));
app.use('/contact',  require('./routes/contact'));
app.use('/dispatch', require('./routes/dispatch'));

// ── BRANDED 404 ERROR HANDLER ──
app.use((req, res) => {
  res.status(404).render('404', { title: '404 — Techo Xpress', page: '404' });
});

// ── EXECUTION BOUNDARIES ──
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Techo Xpress Engine running on http://localhost:${PORT}`));
}

module.exports = app;