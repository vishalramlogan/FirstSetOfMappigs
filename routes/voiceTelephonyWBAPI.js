const express = require('express');
const router = express.Router();
const authUser = require('../middleware/userAuth');
const voiceTelephonyWB = require('../controllers/voiceTelephonyWB');

//add a VoiceTelephonyWideband collection database
router.post('/users/:username/voiceTelephonyWideband',authUser,voiceTelephonyWB.VoiceTelephonyWB_post);
router.post('/users/:username/voiceTelephonyWideband/SpeechDelaySA',authUser,voiceTelephonyWB.VoiceTelephonyWBSpeechDelaySA_post);
router.post('/users/:username/voiceTelephonyWideband/PacketLossSA',authUser,voiceTelephonyWB.VoiceTelephonyWBPacketLossSA_post);
router.post('/users/:username/voiceTelephonyWideband/TalkerEchoSA',authUser,voiceTelephonyWB.VoiceTelephonyWBTalkerEchoSA_post);
router.post('/users/:username/voiceTelephonyWideband/EquipmentImpairmentSA',authUser,voiceTelephonyWB.VoiceTelephonyWBEquipmentImpairmentSA_post);
router.post('/users/:username/voiceTelephonyWideband/PacketLossRoubustnessSA',authUser,voiceTelephonyWB.VoiceTelephonyWBPacketLossRoubustnessSA_post);

module.exports = router;