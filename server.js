const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config(); // Load environment configurations

const app = express();

// ── VERCEL PROXY TERMINATION RULES ──
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

// ── 🔒 LAZY-LOADED SERVERLESS SESSION STORAGE MIDDLEWARE ──
let lazySessionMiddleware;

app.use((req, res, next) => {
  // Instantiates the store pool ONLY when a live visitor hits the site container
  if (!lazySessionMiddleware) {
    const storeConfig = process.env.MONGODB_URI 
      ? MongoStore.create({
          mongoUrl: process.env.MONGODB_URI,
          collectionName: 'sessions',
          ttl: 24 * 60 * 60
        })
      : undefined;

    lazySessionMiddleware = session({
      secret: 'techo_xpress_secure_matrix_key_2026', 
      resave: false,
      saveUninitialized: false,
      store: storeConfig,
      cookie: { 
        maxAge: 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'lax'
      }
    });
  }
  // Pass execution down to the dynamically compiled session store runner
  lazySessionMiddleware(req, res, next);
});

// Global variables middleware: Passes login status automatically to ALL your EJS files
app.use((req, res, next) => {
  res.locals.isLoggedIn = req.session ? req.session.isLoggedIn : false;
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

// ── CRITICAL EXPORT LINE ──
module.exports = app;