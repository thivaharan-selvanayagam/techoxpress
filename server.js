const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config(); // Load environment configurations

const app = express();

// ── VERCEL PROXY TRUST RULES ──
app.set('trust proxy', 1);

// ── 💾 NON-BLOCKING SERVERLESS CONNECTION POOL ──
// We initialize the connection immediately and pass the client promise directly to MongoStore
const clientPromise = mongoose.connect(process.env.MONGODB_URI, {
  connectTimeoutMS: 15000,
  socketTimeoutMS: 45000
}).then(mongooseInstance => {
  console.log('💾 Distributed database uplink successfully established.');
  return mongooseInstance.connection.getClient();
}).catch(err => {
  console.error('🔴 Critical Database initialization failure:', err);
});

// Middleware to ensure database availability on every incoming request
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState >= 1) {
    return next();
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    next();
  } catch (err) {
    res.status(500).send('Logistics Engine Connection Timeout.');
  }
});

// ── MIDDLEWARE SETTINGS ──
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ── 🔒 PERSISTENT DISTRIBUTED SESSION STORE (SHARDS VIA CLIENT PROMISE) ──
app.use(session({
  secret: 'techo_xpress_secure_matrix_key_2026', 
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    clientPromise: clientPromise, // 👈 Shares the exact same connection pool seamlessly
    collectionName: 'sessions',
    ttl: 24 * 60 * 60
  }),
  cookie: { 
    maxAge: 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'lax'
  }
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