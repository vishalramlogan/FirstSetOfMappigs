const express = require('express');
const router = express.Router();
const authUser = require('../middleware/userAuth');
const videoStreamingLR = require('../controllers/videoStreamingLR');

//add a video streaming lower resolution collection database
router.post('/users/:username/videoStreamingLR',authUser,videoStreamingLR.VideoStreamingLR_post);
router.post('/users/:username/videoStreamingLR/PacketLossSA',authUser,videoStreamingLR.VideoStreamingLRPacketLossSA_post);
router.post('/users/:username/videoStreamingLR/RebufferingSA',authUser,videoStreamingLR.VideoStreamingLRRebufferingSA_post);
router.post('/users/:username/videoStreamingLR/VideoWidthSA',authUser,videoStreamingLR.VideoStreamingLRVideoWidthSA_post);
router.post('/users/:username/videoStreamingLR/VideoHeightSA',authUser,videoStreamingLR.VideoStreamingLRVideoHeightSA_post);
router.post('/users/:username/videoStreamingLR/VideoPLCSA',authUser,videoStreamingLR.VideoStreamingLRVideoPLCSA_post);
router.post('/users/:username/videoStreamingLR/RebufferingLengthSA',authUser,videoStreamingLR.VideoStreamingLRRebufferingLengthSA_post);
router.post('/users/:username/videoStreamingLR/NumRebufferingSA',authUser,videoStreamingLR.VideoStreamingLRNumRebufferingSA_post);
router.post('/users/:username/videoStreamingLR/RebufferingFactorSA',authUser,videoStreamingLR.VideoStreamingLRRebufferingFactorSA_post);
router.post('/users/:username/videoStreamingLR/NumVideosSA',authUser,videoStreamingLR.VideoStreamingLRNumVideosSA_post);
router.post('/users/:username/videoStreamingLR/VideoContentCodingSA',authUser,videoStreamingLR.VideoStreamingLRVideoContentCodingSA_post);
router.post('/users/:username/videoStreamingLR/CodingCompressionSA',authUser,videoStreamingLR.VideoStreamingLRCodingCompressionSA_post);
router.post('/users/:username/videoStreamingLR/MeasureTimeSA',authUser,videoStreamingLR.VideoStreamingLRMeasureTimeSA_post);
router.post('/users/:username/videoStreamingLR/IPPacketLossSA',authUser,videoStreamingLR.VideoStreamingLRIPPacketLossSA_post);
router.post('/users/:username/videoStreamingLR/PacketLossRateSA',authUser,videoStreamingLR.VideoStreamingLRPacketLossRateSA_post);
router.post('/users/:username/videoStreamingLR/GOPLengthSA',authUser,videoStreamingLR.VideoStreamingLRGOPLengthSA_post);
router.post('/users/:username/videoStreamingLR/VideoBitrateSA',authUser,videoStreamingLR.VideoStreamingLRVideoBitrateSA_post);
router.post('/users/:username/videoStreamingLR/VideoFrameRateSA',authUser,videoStreamingLR.VideoStreamingLRVideoFrameRateSA_post);

module.exports = router;