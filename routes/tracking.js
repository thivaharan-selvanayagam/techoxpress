const express = require('express');
const router = express.Router();

const mockOrders = {
  'TXT-2025-001': {
    id: 'TXT-2025-001',
    status: 'delivered',
    statusLabel: 'Delivered',
    sender: 'Techo Labs, Colombo 03',
    recipient: 'Colombo 07',
    weight: '2.4 kg',
    service: 'Same-Day Express',
    eta: 'Delivered Today',
    events: [
      { time: '2:45 PM', date: 'Today',     label: 'Delivered',        desc: 'Package handed to recipient at destination.',   done: true  },
      { time: '1:10 PM', date: 'Today',     label: 'Out for Delivery', desc: 'Rider departed from Colombo Central Hub.',      done: true  },
      { time: '10:30 AM',date: 'Today',     label: 'At Sorting Hub',   desc: 'Package processed at Colombo Central Hub.',     done: true  },
      { time: '8:00 AM', date: 'Today',     label: 'Picked Up',        desc: 'Package collected from sender.',                done: true  },
    ]
  },
  'TXT-2025-002': {
    id: 'TXT-2025-002',
    status: 'transit',
    statusLabel: 'Out for Delivery',
    sender: 'Negombo Warehouse',
    recipient: 'Kandy',
    weight: '5.1 kg',
    service: 'Standard Delivery',
    eta: 'Today by 8:00 PM',
    events: [
      { time: '—',       date: '—',         label: 'Delivered',        desc: 'Awaiting delivery.',                            done: false },
      { time: '9:15 AM', date: 'Today',     label: 'Out for Delivery', desc: 'Rider en route to Kandy.',                     done: true  },
      { time: '6:30 AM', date: 'Today',     label: 'At Sorting Hub',   desc: 'Processed at Negombo Distribution Hub.',       done: true  },
      { time: '4:00 PM', date: 'Yesterday', label: 'Picked Up',        desc: 'Package collected from sender.',                done: true  },
    ]
  }
};

router.get('/', (req, res) => {
  res.render('tracking', { title: 'Track Your Package — Techo Xpress', page: 'tracking', order: null, query: '', error: null });
});

router.post('/', (req, res) => {
  const query = (req.body.trackingId || '').trim().toUpperCase();
  const order = mockOrders[query] || null;
  res.render('tracking', {
    title: 'Track Your Package — Techo Xpress', page: 'tracking',
    order, query,
    error: query && !order ? 'No shipment found for this ID. Please check and try again.' : null
  });
});

module.exports = router;