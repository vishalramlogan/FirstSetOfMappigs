const express = require('express');
const router = express.Router();
const authUser = require('../middleware/userAuth');
const audioStreamingLR = require('../controllers/audioStreamingLR');

//add a audio streaming lower reolution document to database
router.post('/users/:username/audioStreamingLR',authUser,audioStreamingLR.AudioStreamingLR_post);
router.post('/users/:username/audioStreamingLR/AudioBitrateSA',authUser,audioStreamingLR.AudioStreamingLRAudioBitrateSA_post);
router.post('/users/:username/audioStreamingLR/FrameLengthSA',authUser,audioStreamingLR.AudioStreamingLRFrameLengthSA_post);
router.post('/users/:username/audioStreamingLR/AverageBurstSA',authUser,audioStreamingLR.AudioStreamingLRAverageBurstSA_post);
router.post('/users/:username/audioStreamingLR/AudioStreamSA',authUser,audioStreamingLR.AudioStreamingLRAudioStreamSA_post);
router.post('/users/:username/audioStreamingLR/LossRateSA',authUser,audioStreamingLR.AudioStreamingLRLossRateSA_post);
router.post('/users/:username/audioStreamingLR/AudioFramesSA',authUser,audioStreamingLR.AudioStreamingLRAudioFramesSA_post);
router.post('/users/:username/audioStreamingLR/AudioCodecSA',authUser,audioStreamingLR.AudioStreamingLRAudioCodecSA_post);

module.exports = router;