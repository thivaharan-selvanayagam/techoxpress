const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session'); // 👈 Swapped out express-session for serverless cookies
require('dotenv').config(); // Load environment configurations

const app = express();

// ── VERCEL PROXY TRUST RULES ──
app.set('trust proxy', 1);

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

// ── 🔒 SERVERLESS-OPTIMIZED COOKIE SESSION MIDDLEWARE ──
app.use(cookieSession({
  name: 'techo_session',
  keys: ['techo_xpress_matrix_secret_2026'], // Secret encryption signature key
  maxAge: 24 * 60 * 60 * 1000, // Session expires automatically after 24 hours
  secure: process.env.NODE_ENV === 'production', // Encrypts over HTTPS when live on Vercel
  sameSite: 'lax'
}));

// Global variables middleware: Passes login status automatically to ALL your EJS files
app.use((req, res, next) => {
  res.locals.isLoggedIn = (req.session && req.session.isLoggedIn) ? req.session.isLoggedIn : false;
  next();
});

// ── SYSTEM ROUTING CHANNELS ──
app.use('/',         require('./routes/home'));
app.use('/',         require('./routes/auth'));     
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