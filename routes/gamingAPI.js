const express = require('express');
const router = express.Router();
const authUser = require('../middleware/userAuth');
const gaming = require('../controllers/gaming');

//add a gaming variables database
router.post('/users/:username/gaming',authUser,gaming.gaming_post);
router.post('/users/:username/gaming/BitrateSA',authUser,gaming.gamingBitrateSA_post);
router.post('/users/:username/gaming/NumPixelsSA',authUser,gaming.gamingNumPixelsSA_post);
router.post('/users/:username/gaming/PacketLossSA',authUser,gaming.gamingPacketLossSA_post);
router.post('/users/:username/gaming/FrameRateSA',authUser,gaming.gamingFrameRateSA_post);
router.post('/users/:username/gaming/LossSensitivitySA',authUser,gaming.gamingLossSensitivitySA_post);
router.post('/users/:username/gaming/EncodingComplexitySA',authUser,gaming.gamingEncodingComplexitySA_post);
router.post('/users/:username/gaming/DelaySA',authUser,gaming.gamingDelaySA_post);

module.exports = router;