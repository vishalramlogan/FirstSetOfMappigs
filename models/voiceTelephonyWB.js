const mongoose =require('mongoose');
const Schema = mongoose.Schema;

// create voiceTelephonyWB Schema
const VoiceTelephonyWidebandSchema = new Schema({
    username: {
        type: String,
        required: [true],
        ref: "user"
    },
    speechDelay: {
        type: [Number],
        required: [true]
    },
    speechPacketLossRate: {
        type: [Number],
        required: [true]
    },
    talkerEchoLoudness: {
        type: [Number],
        required: [true]
    },
    equipmentImpairment: {
        type: [Number],
        required: [true]
    },
    packetLossRoubustness: {
        type: [Number],
        required: [true]
    },
    idVTWB: {
        type: String,
        required: [true]
    },
    mosVTWB: {
        type: [Number]
    }
});

const VoiceTelephonyWideband = mongoose.model('voiceTelephonyWideband', VoiceTelephonyWidebandSchema);
module.exports = VoiceTelephonyWideband;