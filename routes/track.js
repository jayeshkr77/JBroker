const express = require('express');
const router = express.Router();

const trackController = require('../controllers/trackController');


// /api/track
router.get('/',trackController.trackStockPriceFromGoogleSheets);
// router.post('/',couponController.couponCreate);
// router.post('/Apply', couponController.couponApply);

module.exports = router;