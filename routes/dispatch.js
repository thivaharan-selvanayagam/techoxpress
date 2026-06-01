const express = require('express');
const router = express.Router();
const Rider = require('../models/Rider');
const Parcel = require('../models/Parcel');

// GET: Fetch available freelance riders from MongoDB and render terminal
router.get('/', async (req, res) => {
  try {
    const activeRiders = await Rider.find({ status: 'Available' });
    res.render('dispatch', { 
      title: 'Xpress Dispatch Terminal', 
      page: 'dispatch', 
      riders: activeRiders, 
      success: false, 
      error: null 
    });
  } catch (err) {
    console.error('Failed to load active fleet:', err);
    res.render('dispatch', { 
      title: 'Xpress Dispatch Terminal', 
      page: 'dispatch', 
      riders: [], 
      success: false, 
      error: 'Logistics Engine Error: Unable to stream active rider profiles.' 
    });
  }
});

// GET: Render the New Parcel Intake Form
router.get('/add', (req, res) => {
  res.render('add-parcel', {
    title: 'New Parcel Intake — Techo Xpress',
    page: 'add-parcel',
    success: false,
    error: null
  });
});

// POST: Process Intake Form and Instantiate a New Cloud Parcel Document
router.post('/add', async (req, res) => {
  const { trackingId, sender, recipient, weight, service } = req.body;
  const cleanId = (trackingId || '').trim().toUpperCase();

  try {
    // Enforcement boundary: Block duplicates
    const duplicateCheck = await Parcel.findOne({ trackingId: cleanId });
    if (duplicateCheck) throw new Error(`Tracking sequence vector ${cleanId} already exists in registry.`);

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const currentDate = 'Today';

    // Build the package document based on your Mongoose Schema
    const freshParcel = new Parcel({
      trackingId: cleanId,
      sender: sender.trim(),
      recipient: recipient.trim(),
      weight: weight.trim(),
      service: service,
      status: 'transit',
      statusLabel: 'Manifested',
      eta: 'Pending Assignment',
      assignedRider: null,
      events: [{
        time: currentTime,
        date: currentDate,
        label: 'Manifested',
        desc: 'Shipment order generated via Web Intake Terminal. Cargo awaiting courier allocation.',
        done: true
      }]
    });

    await freshParcel.save();

    res.render('add-parcel', {
      title: 'New Parcel Intake — Techo Xpress',
      page: 'add-parcel',
      success: `Shipment ${cleanId} successfully registered. Vector injected into cloud dataset.`,
      error: null
    });

  } catch (err) {
    console.error('Intake transaction faulted:', err);
    res.render('add-parcel', {
      title: 'New Parcel Intake — Techo Xpress',
      page: 'add-parcel',
      success: false,
      error: `Registry Rejection: ${err.message}`
    });
  }
});

// POST: Bind barcode tracking array metrics to the chosen Rider document
router.post('/commit', async (req, res) => {
  const { riderId, trackingIds } = req.body;
  const parsedIds = Array.isArray(trackingIds) ? trackingIds : [trackingIds].filter(Boolean);

  try {
    const targetRider = await Rider.findById(riderId);
    if (!targetRider) throw new Error('Selected courier driver node not found.');
    if (parsedIds.length === 0) throw new Error('Staging area clear. Scan at least one parcel.');

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const currentDate = 'Today';

    await Parcel.updateMany(
      { trackingId: { $in: parsedIds } },
      {
        $set: { 
          assignedRider: targetRider._id,
          status: 'transit',
          statusLabel: 'Out for Delivery',
          eta: 'Arriving Today'
        },
        $push: {
          events: {
            $each: [{
              time: currentTime,
              date: currentDate,
              label: 'Rider Dispatched',
              desc: `Package picked up and route vector mapped to freelance courier ${targetRider.name}.`,
              done: true
            }],
            $position: 0
          }
        }
      }
    );

    targetRider.status = 'In Transit';
    await targetRider.save();

    const remainingRiders = await Rider.find({ status: 'Available' });
    res.render('dispatch', { 
      title: 'Xpress Dispatch Terminal', 
      page: 'dispatch', 
      riders: remainingRiders, 
      success: `Successfully allocated ${parsedIds.length} parcel(s) to courier ${targetRider.name}. Manifest active.`, 
      error: null 
    });

  } catch (err) {
    console.error('Dispatch error encountered:', err);
    const fallbackRiders = await Rider.find({ status: 'Available' }).catch(() => []);
    res.render('dispatch', { 
      title: 'Xpress Dispatch Terminal', 
      page: 'dispatch', 
      riders: fallbackRiders, 
      success: false, 
      error: `Manifest Processing Interrupted: ${err.message}` 
    });
  }
});

// POST: Process Delivery Handover Confirmation & Complete Shipment Cycle
router.post('/deliver', async (req, res) => {
  const { trackingId } = req.body;
  const cleanId = (trackingId || '').trim().toUpperCase();

  try {
    const targetParcel = await Parcel.findOne({ trackingId: cleanId });
    if (!targetParcel) throw new Error('Tracking ID sequence vector not found in active registries.');

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const currentDate = 'Today';

    targetParcel.status = 'delivered';
    targetParcel.statusLabel = 'Delivered';
    targetParcel.eta = 'Completed';

    targetParcel.events.unshift({
      time: currentTime,
      date: currentDate,
      label: 'Package Delivered',
      desc: `Parcel successfully dropped off. Safe-drop lifecycle completed by courier.`,
      done: true
    });

    await targetParcel.save();

    if (targetParcel.assignedRider) {
      const activeCourier = await Rider.findById(targetParcel.assignedRider);
      if (activeCourier) {
        activeCourier.status = 'Available';
        await activeCourier.save();
      }
    }

    const activeRiders = await Rider.find({ status: 'Available' });
    res.render('dispatch', { 
      title: 'Xpress Dispatch Terminal', 
      page: 'dispatch', 
      riders: activeRiders, 
      success: `Shipment ${cleanId} successfully flagged as DELIVERED. Courier returned to base fleet pool.`, 
      error: null 
    });

  } catch (err) {
    console.error('Delivery confirmation error:', err);
    const fallbackRiders = await Rider.find({ status: 'Available' }).catch(() => []);
    res.render('dispatch', { 
      title: 'Xpress Dispatch Terminal', 
      page: 'dispatch', 
      riders: fallbackRiders, 
      success: false, 
      error: `Delivery Logging Error: ${err.message}` 
    });
  }
});

module.exports = router;