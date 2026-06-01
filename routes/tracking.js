const express = require('express');
const router = express.Router();
const Parcel = require('../models/Parcel'); // Imported Mongoose Data Model

// GET: Render baseline tracking dashboard area
router.get('/', (req, res) => {
  res.render('tracking', { 
    title: 'Track Your Package — Techo Xpress', 
    page: 'tracking', 
    order: null, 
    query: '', 
    error: null 
  });
});

// POST: Run asynchronous database query trace against tracking inputs
router.post('/', async (req, res) => {
  const query = (req.body.trackingId || '').trim().toUpperCase();
  
  try {
    // 1. Core query intercept: locate document matching tracking sequence and pull linked rider profile
    const databaseParcel = await Parcel.findOne({ trackingId: query }).populate('assignedRider');
    
    let order = null;
    
    if (databaseParcel) {
      // 2. Data Mapping Layer: Convert mongoose document to plain object
      order = databaseParcel.toObject();
      // 3. Backward Compatibility: Maps trackingId to order.id so your existing EJS code doesn't break
      order.id = databaseParcel.trackingId; 
    }

    res.render('tracking', {
      title: 'Track Your Package — Techo Xpress', 
      page: 'tracking',
      order, 
      query,
      error: !order ? 'No shipment found for this ID. Please check and try again.' : null
    });

  } catch (err) {
    console.error('Database exception handled during telemetry trace:', err);
    res.render('tracking', {
      title: 'Track Your Package — Techo Xpress', 
      page: 'tracking',
      order: null, 
      query,
      error: 'Logistics engine connection timeout. Please try scanning again shortly.'
    });
  }
});

module.exports = router;