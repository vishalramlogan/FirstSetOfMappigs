const mongoose =require('mongoose');
const Schema = mongoose.Schema;

// create voiceTelephonyNB Schema
const VoiceTelephonyNarrowbandSchema = new Schema({
    username: {
        type: String,
        required: [true],
        ref: "user"
    },
    speechDelayNB: {
        type: [Number],
        required: [true]
    },
    speechPacketLossRateNB: {
        type: [Number],
        required: [true]
    },
    talkerEchoLoudnessNB: {
        type: [Number],
        required: [true]
    },
    combination: {
        type: [Number],
        required: [true]
    },
    idVTNB: {
        type: String,
        required: [true]
    },
    mosVTNB: {
        type: [Number]
    }
});

const VoiceTelephonyNarrowband = mongoose.model('voiceTelephonyNarrowband', VoiceTelephonyNarrowbandSchema);
module.exports = VoiceTelephonyNarrowband;