const express = require('express');
const router = express.Router();
const authUser = require('../middleware/userAuth');
const videoStreamingHR = require('../controllers/videoStreamingHR');

//add a video streaming higher resolution collection database
router.post('/users/:username/videoStreamingHR',authUser,videoStreamingHR.VideoStreamingHR_post);
router.post('/users/:username/videoStreamingHR/NumPixelsSA',authUser,videoStreamingHR.VideoStreamingHRNumPixelsSA_post);
router.post('/users/:username/videoStreamingHR/VideoResolutionSA',authUser,videoStreamingHR.VideoStreamingHRVideoResolutionSA_post);
router.post('/users/:username/videoStreamingHR/SliceFrameSA',authUser,videoStreamingHR.VideoStreamingHRSliceFrameSA_post);
router.post('/users/:username/videoStreamingHR/VideoBitrateSA',authUser,videoStreamingHR.VideoStreamingHRVideoBitrateSA_post);
router.post('/users/:username/videoStreamingHR/FrameRateSA',authUser,videoStreamingHR.VideoStreamingHRFrameRateSA_post);
router.post('/users/:username/videoStreamingHR/VideoPLCSA',authUser,videoStreamingHR.VideoStreamingHRVideoPLCSA_post);
router.post('/users/:username/videoStreamingHR/FreezingRatioSA',authUser,videoStreamingHR.VideoStreamingHRFreezingRatioSA_post);
router.post('/users/:username/videoStreamingHR/LossMagnitudeSA',authUser,videoStreamingHR.VideoStreamingHRLossMagnitudeSA_post);

module.exports = router;