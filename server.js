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

// ── 🔒 LAZY-LOADED SERVERLESS SESSION STORAGE MIDDLEWARE WITH ERROR CATCHING ──
let lazySessionMiddleware;

app.use((req, res, next) => {
  if (!lazySessionMiddleware) {
    try {
      let storeConfig;

      if (process.env.MONGODB_URI) {
        storeConfig = MongoStore.create({
          mongoUrl: process.env.MONGODB_URI,
          collectionName: 'sessions',
          ttl: 24 * 60 * 60,
          mongoOptions: {
            connectTimeoutMS: 15000, // Gives serverless cold-starts ample time to authenticating
            socketTimeoutMS: 45000
          }
        });

        // 🛡️ Catch asynchronous database connection errors before they cause a Vercel 500 invocation crash
        storeConfig.on('error', function(mongoStoreError) {
          console.error("⚠️ MongoStore Session Async Connection Error:", mongoStoreError);
        });
      }

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
    } catch (setupError) {
      console.error("⚠️ Fallback activated: Session store initialization faulted:", setupError);
      // Fail-safe fallback to temporary memory instance so your app never dies with a 500 error
      lazySessionMiddleware = session({
        secret: 'techo_xpress_secure_matrix_key_2026',
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 24 * 60 * 60 * 1000, secure: false, sameSite: 'lax' }
      });
    }
  }
  lazySessionMiddleware(req, res, next);
});

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

// ── 🛠️ REAL-TIME SYSTEM FAULT DIAGNOSTIC INTERCEPTOR ──
// Catches any uncaught exceptions globally and forces a readable layout printout
app.use((err, req, res, next) => {
  console.error('💥 CRITICAL ENGINE FAULT:', err.stack);
  res.status(500).send(`
    <div style="padding: 2.5rem; font-family: monospace; background: #0d0d11; color: #ff5555; border-radius: var(--radius); margin: 2rem; border: 1px solid #e74c3c; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
      <h2 style="color: #e74c3c; margin-top: 0; font-family: sans-serif; letter-spacing: 0.02em;">Techo Xpress — Application Crash Diagnostic</h2>
      <p style="color: #fff; font-size: 1.1rem;"><strong>Incident Message:</strong> ${err.message}</p>
      <div style="color: #64748b; font-size: 0.85rem; margin-bottom: 1rem;">Trace Log Stack Information:</div>
      <pre style="background: #000000; padding: 1.5rem; color: #94a3b8; overflow-x: auto; border: 1px solid rgba(255,255,255,0.05); font-size: 0.85rem; line-height: 1.4rem; border-radius: 4px;">${err.stack}</pre>
      <p style="color: #475569; font-size: 0.8rem; margin-top: 1.5rem;">➔ Check your environment setups or database access cluster configurations.</p>
    </div>
  `);
});

// ── EXECUTION BOUNDARIES ──
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Techo Xpress Engine running on http://localhost:${PORT}`));
}

// ── CRITICAL EXPORT LINE ──
module.exports = app;