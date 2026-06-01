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

    // Atomic Update Sequence
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
            $position: 0 // Injects new logs cleanly at the top of the timeline array
          }
        }
      }
    );

    // Pivot courier state to busy mode
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

module.exports = router;