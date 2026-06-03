const express = require('express');
const router = express.Router();
const Rider = require('../models/Rider');
const Parcel = require('../models/Parcel');

// ── COMPREHENSIVE CITY COMMISSION MATRIX ──
const cityCommissions = {
  "40 village": 200, "aanaikattiyaveli": 200, "aarayampathy": 150, "aarumukaththan kudiyiruppu": 150,
  "aayithiyamalai": 200, "amirthakali": 150, "ampilanthurai": 150, "arasaditheevu": 150, "arasady": 150,
  "bakiyella": 200, "batticaloa": 150, "batticaloa town": 150, "brainthuraichenai": 150, "central camp": 200,
  "chenkalady": 150, "chettipalaiyam": 150, "eechantheevu": 150, "eravur": 150, "eruvil": 150,
  "ilupadichchenai (kannankudah)": 150, "ilupadichchenai - kannankudah": 150, "iluppadichenai - karadiyanaru": 150,
  "iruthayapuram": 150, "iruttucholaimadu": 150, "iyankeny": 150, "jeyanthipuram": 150, "kaakachchivettai": 200,
  "kaankeyanodai": 150, "kaayankeny": 150, "kadaloor (santhiveli)": 150, "kadaloor - santhiveli": 150,
  "kadukamunai": 150, "kalkudah": 150, "kallady": 150, "kallady mugathuvaram": 150, "kallady uppodai": 150,
  "kallady veloor": 150, "kalladytheru": 150, "kalliyankadu": 150, "kalumunthaveli": 200, "kaluthavalai": 150,
  "kaluwanchikudi": 150, "kaluwankeny": 150, "kannakipuram": 200, "kannankudah": 150, "karadiyanaru": 150,
  "karaiyaakan theevu": 150, "karavetti": 200, "karuvakeny": 150, "karuveppankerni": 150, "katchenai": 150,
  "kathankudy": 150, "kathiraveli": 200, "kawathamunai": 150, "kiran": 150, "kirankulam": 150, "kiththul": 200,
  "kokkatichcholai": 150, "kokkuvil": 150, "komathurai": 150, "koorakallimadu": 150, "kooraveli": 150,
  "koralankeny": 150, "koththiyapulai": 150, "kottaikallaru": 150, "kovil poratheevu": 150, "kudumpimalai": 200,
  "kumarapuram": 150, "kumburumulai": 150, "kunjankulam": 200, "kurinjamunai": 150, "kurukalmadam": 150,
  "kurumanveli": 150, "maankaadu": 150, "maavadivembu": 150, "mahiladiththeevu": 150, "mahiloor": 150,
  "makilavettuvan": 200, "malaiyrakattu": 200, "mamangam": 150, "manalpitti": 150, "mangikattu": 150,
  "manjanthoduvaai": 150, "manmunai": 150, "mandoor": 150, "mattikali": 150, "mavadichenai": 150,
  "mayilampaveli": 150, "meravodai": 150, "munaikaadu": 150, "murakottanchenai": 150, "muruththanai": 200,
  "naavatkaadu": 150, "nadarajananthapuram": 150, "naripulthootam": 200, "nasivantheevu": 150, "navalady": 150,
  "navalady - kallady": 150, "navatkeny": 150, "navatkuda": 150, "nediyavettai": 200, "nochchimunai": 150,
  "odamavadi": 150, "ollikulam": 150, "oonthachchimadam": 150, "paalaiyadivettai": 200, "palachcholai": 150,
  "palameenmadu": 150, "palamunai": 150, "palukaamam": 150, "pandaariyaveli": 150, "pankudaveli": 150,
  "pannichankeny": 200, "paruththichchenai": 150, "pasikudah": 150, "pattiruppu": 150, "pavakodichchenai": 200,
  "periya neelavanai": 150, "periya pooratheevu": 150, "periya urani": 150, "periyakallaru": 150, "periyauppodai": 150,
  "pondukalsenai": 200, "poththanai": 200, "pulipaainthakal": 200, "puliyantheevu": 150, "pullumalai": 200,
  "punanai": 200, "punnaicholai": 150, "punnakudah": 150, "puthoor": 150, "puthu mandapaththady": 150,
  "puthukudiyiruppu (aarayampathi)": 150, "puthukudiyiruppu - aarayampathi": 150, "rithithenna": 200,
  "sallitheevu": 200, "sankarpuram": 200, "santhiveli": 150, "sathurukondan": 150, "savukady": 150,
  "seeththukudah": 150, "sinna uppoodai": 150, "sinna urani": 150, "siththandi": 150, "suravanaiyootru": 200,
  "thaandiyadi": 150, "thalankudah": 150, "thamaraikeny (batticaloa)": 150, "thamaraikeny - batticaloa": 150,
  "thandavanveli": 150, "thannamunai": 150, "theethatheevu": 150, "thikilivettai": 200, "thikkodai": 200,
  "thimilatheevu": 150, "thiraimadu": 150, "thirichchandur": 150, "thirukondaimadu": 150, "thirupperumthurai": 150,
  "thiyawattuwan": 150, "thumpankeny": 150, "thurai neelavanai": 200, "unnichchai": 200, "uppukaraichai": 150,
  "urukamam": 200, "vahaneri": 200, "vaharai": 200, "valaichchenai": 150, "valaiyiravu": 150,
  "vantharumulai": 150, "vavunatheevu": 150, "veechchikalmunai": 150, "vellaveli": 150, "velodiyamalai": 200,
  "vinayakapuram (valaichenai)": 150, "vinayakapuram - valaichenai": 150
};

// Helper function to generate standardized Sri Lankan timestamp vectors
const getSriLankaTiming = () => {
  const optionsTime = { timeZone: 'Asia/Colombo', hour: '2-digit', minute: '2-digit', hour12: true };
  const currentTime = new Date().toLocaleTimeString('en-US', optionsTime);
  const currentDate = 'Today';
  return { currentTime, currentDate };
};

// GET: Load main terminal window data packages
router.get('/', async (req, res) => {
  try {
    const allRiders = await Rider.find({});
    const transitRiders = await Rider.find({ status: 'In Transit' });
    
    const dynamicFleet = await Promise.all(transitRiders.map(async (rider) => {
      const activePackages = await Parcel.find({ assignedRider: rider._id, status: 'transit' });
      return { rider, activePackages };
    }));

    res.render('dispatch', { 
      title: 'Xpress Dispatch Terminal', 
      page: 'dispatch', 
      riders: allRiders.filter(r => r.status === 'Available'), 
      allRiders: allRiders, 
      dynamicFleet,
      success: false, 
      error: null 
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Critical Core Interface Load Fault.");
  }
});

// GET: Render the New Parcel Intake Form
router.get('/add', (req, res) => {
  res.render('add-parcel', { title: 'New Parcel Intake — Techo Xpress', page: 'add-parcel', success: false, error: null });
});

// GET: Render the Rider Performance Reports Selection Console
router.get('/report', async (req, res) => {
  try {
    const ridersList = await Rider.find({});
    res.render('report', {
      title: 'Rider Metrics Report — Techo Xpress',
      page: 'report',
      riders: ridersList,
      reportData: null,
      success: false,
      error: null
    });
  } catch (err) {
    res.status(500).send("Report Subsystem Engine Failure.");
  }
});

// POST: Query, Process, and Calculate Metrics for Selected Rider and Date Range
router.post('/report', async (req, res) => {
  const { riderId, startDate, endDate } = req.body;

  try {
    const ridersList = await Rider.find({});
    const chosenRider = await Rider.findById(riderId);
    if (!chosenRider) throw new Error("Selected rider profile not found in database registries.");

    // Lock date limits strictly matching Sri Lankan Midnight offsets (+05:30)
    const absoluteStart = new Date(startDate + "T00:00:00+05:30");
    const absoluteEnd = new Date(endDate + "T23:59:59+05:30");

    // Fetch all successfully completed matching parcel parameters
    const deliveredParcels = await Parcel.find({
      assignedRider: riderId,
      status: 'delivered',
      updatedAt: { $gte: absoluteStart, $lte: absoluteEnd }
    });

    // Run Accounting Algorithms
    let totalCommissionEarned = 0;
    let totalCollectedCOD = 0;

    deliveredParcels.forEach(parcel => {
      let itemComm = Number(parcel.commission);
      if (!itemComm || itemComm === 0) {
        const lookupKey = (parcel.recipient || '').trim().toLowerCase();
        itemComm = cityCommissions[lookupKey] || 150;
      }
      totalCommissionEarned += itemComm;
      totalCollectedCOD += (parcel.codPrice || 0);
    });

    const reportData = {
      riderName: chosenRider.name,
      vehicle: chosenRider.vehicle,
      startStr: startDate,
      endStr: endDate,
      totalDelivered: deliveredParcels.length,
      totalCommission: totalCommissionEarned,
      totalCOD: totalCollectedCOD,
      parcels: deliveredParcels
    };

    res.render('report', {
      title: 'Rider Metrics Report — Techo Xpress',
      page: 'report',
      riders: ridersList,
      reportData,
      success: `Performance matrix compiled for courier ${chosenRider.name}.`,
      error: null
    });

  } catch (err) {
    console.error(err);
    const fallbackRiders = await Rider.find({}).catch(() => []);
    res.render('report', {
      title: 'Rider Metrics Report — Techo Xpress',
      page: 'report',
      riders: fallbackRiders,
      reportData: null,
      success: false,
      error: `Report Generation Terminated: ${err.message}`
    });
  }
});

// POST: Process Intake Form and Instantiate a New Cloud Parcel Document
router.post('/add', async (req, res) => {
  const { trackingId, sender, recipient, weight, service, codPrice } = req.body;
  const cleanId = (trackingId || '').trim().toUpperCase();
  try {
    const duplicateCheck = await Parcel.findOne({ trackingId: cleanId });
    if (duplicateCheck) throw new Error(`Tracking sequence vector ${cleanId} already exists in registry.`);
    
    const searchCityKey = recipient.trim().toLowerCase();
    const assignedCommission = cityCommissions[searchCityKey] || 150;
    const { currentTime, currentDate } = getSriLankaTiming();

    const freshParcel = new Parcel({
      trackingId: cleanId, sender: sender.trim(), recipient: recipient.trim(), weight: weight.trim(), service,
      codPrice: Number(codPrice) || 0, commission: assignedCommission, status: 'transit', statusLabel: 'Manifested',
      eta: 'Pending Assignment', assignedRider: null,
      events: [{ time: currentTime, date: currentDate, label: 'Manifested', desc: `Shipment entry logged at hub. Commission set: LKR ${assignedCommission}`, done: true }]
    });

    await freshParcel.save();
    res.render('add-parcel', { title: 'New Parcel Intake — Techo Xpress', page: 'add-parcel', success: `Shipment ${cleanId} logged successfully.`, error: null });
  } catch (err) {
    res.render('add-parcel', { title: 'New Parcel Intake — Techo Xpress', page: 'add-parcel', success: false, error: err.message });
  }
});

// POST: Bind outbound manifest arrays to target riders
router.post('/commit', async (req, res) => {
  const { riderId, trackingIds } = req.body;
  const parsedIds = Array.isArray(trackingIds) ? trackingIds : [trackingIds].filter(Boolean);
  try {
    const targetRider = await Rider.findById(riderId);
    if (!targetRider) throw new Error('Selected courier driver node not found.');
    if (parsedIds.length === 0) throw new Error('Staging area clear. Scan at least one parcel.');

    const { currentTime, currentDate } = getSriLankaTiming();
    await Parcel.updateMany(
      { trackingId: { $in: parsedIds } },
      {
        $set: { assignedRider: targetRider._id, status: 'transit', statusLabel: 'Out for Delivery', eta: 'Arriving Today' },
        $push: { events: { $each: [{ time: currentTime, date: currentDate, label: 'Rider Dispatched', desc: `Package out via courier ${targetRider.name}.`, done: true }], $position: 0 } }
      }
    );

    targetRider.status = 'In Transit';
    await targetRider.save();
    res.redirect('/dispatch');
  } catch (err) {
    res.redirect('/dispatch');
  }
});

// POST: Close Route Workflow (Closing-by-Exception Audit Engine)
router.post('/close-route', async (req, res) => {
  const { riderId, remainingIds } = req.body;
  const parsedRemaining = Array.isArray(remainingIds) ? remainingIds : [remainingIds].filter(Boolean);
  const upperRemaining = parsedRemaining.map(id => id.trim().toUpperCase());

  try {
    const rider = await Rider.findById(riderId);
    if (!rider) throw new Error('Rider context missing.');

    const activeParcels = await Parcel.find({ assignedRider: riderId, status: 'transit' });
    const { currentTime, currentDate } = getSriLankaTiming();

    let collectedCOD = 0;
    let totalRiderCommission = 0;

    for (let parcel of activeParcels) {
      if (upperRemaining.includes(parcel.trackingId.toUpperCase())) {
        parcel.assignedRider = null;
        parcel.statusLabel = 'Returned to Hub';
        parcel.eta = 'Pending Re-assignment';
        parcel.events.unshift({ time: currentTime, date: currentDate, label: 'Delivery Failed', desc: 'Returned back to gateway inventory stacks.', done: true });
        await parcel.save();
      } else {
        parcel.status = 'delivered';
        parcel.statusLabel = 'Delivered';
        parcel.eta = 'Completed';
        parcel.events.unshift({ time: currentTime, date: currentDate, label: 'Delivered', desc: 'Delivery verification check-out completed.', done: true });
        await parcel.save();

        let itemCommission = Number(parcel.commission);
        if (!itemCommission || itemCommission === 0) {
          const searchCityKey = (parcel.recipient || '').trim().toLowerCase();
          itemCommission = cityCommissions[searchCityKey] || 150;
        }

        collectedCOD += (parcel.codPrice || 0);
        totalRiderCommission += itemCommission;
      }
    }

    const sessionOutstandingDebt = Math.max(0, collectedCOD - totalRiderCommission);

    rider.pendingBalance += sessionOutstandingDebt;
    rider.status = 'Available';
    await rider.save();

    res.redirect('/dispatch');
  } catch (err) {
    console.error('Core audit loop fault:', err);
    res.redirect('/dispatch');
  }
});

// POST: Clear Ledger Cash Receivables
router.post('/clear-balance', async (req, res) => {
  const { riderId } = req.body;
  try {
    const rider = await Rider.findById(riderId);
    if (rider) {
      rider.pendingBalance = 0; 
      await rider.save();
    }
    res.redirect('/dispatch');
  } catch (err) {
    res.redirect('/dispatch');
  }
});

module.exports = router;