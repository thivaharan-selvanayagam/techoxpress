const express = require('express');
const router = express.Router();
const Parcel = require('../models/Parcel');

// ── COMPREHENSIVE CITY COMMISSION MATRIX FOR LIVE TERMINAL RESOLUTIONS ──
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

// GET: Render baseline tracking dashboard area
router.get('/', (req, res) => {
  res.render('tracking', { title: 'Track Your Package — Techo Xpress', page: 'tracking', order: null, query: '', error: null });
});

// POST: Run asynchronous database query trace against tracking inputs
router.post('/', async (req, res) => {
  const query = (req.body.trackingId || '').trim().toUpperCase();
  
  try {
    const databaseParcel = await Parcel.findOne({ trackingId: query }).populate('assignedRider');
    let order = null;
    
    if (databaseParcel) {
      order = databaseParcel.toObject();
      order.id = databaseParcel.trackingId; 

      // ── 🔒 DOUBLE-LOCK SECURITY LOOKUP FOR THE TRACKING PANEL ──
      // If database field is missing, evaluate it live using the city lookup dictionary
      if (!order.commission || order.commission === 0) {
        const searchCityKey = (order.recipient || '').trim().toLowerCase();
        order.commission = cityCommissions[searchCityKey] || 150;
      }
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