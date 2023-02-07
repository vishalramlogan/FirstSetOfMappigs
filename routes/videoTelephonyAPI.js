const express = require('express');
const router = express.Router();
const authUser = require('../middleware/userAuth');
const videoTelephony = require('../controllers/videoTelephony');

//add a videoTelephony variables database
router.post('/users/:username/videoTelephony',authUser,videoTelephony.VideoTelephony_post);
router.post('/users/:username/videoTelephony/PacketLossSA',authUser,videoTelephony.VideoTelephonyPacketLossSA_post);
router.post('/users/:username/videoTelephony/FrameRateSA',authUser,videoTelephony.VideoTelephonyFrameRateSA_post);
router.post('/users/:username/videoTelephony/BitRateSA',authUser,videoTelephony.VideoTelephonyBitRateSA_post);
router.post('/users/:username/videoTelephony/CombinationSA',authUser,videoTelephony.VideoTelephonyCombinationSA_post);

module.exports = router;