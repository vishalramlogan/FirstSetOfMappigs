const mongoose =require('mongoose');
const Schema = mongoose.Schema;

// create audio streaming higher resolution Schema
const AudioStreamingHRSchema = new Schema({
    username: {
        type: String,
        required: [true],
        ref: "user"
    },
    audioBitrate: {
        type: [Number],
        required:  [true]
    },
    videoBitrate: {
        type: [Number],
        required:  [true]
    },
    rtpPacketLoss: {
        type: [Number],
        required:  [true]
    },
    rtpPacketLossBurstiness: {
        type: [Number],
        required:  [true]
    },
    numRTPPacketsTSPackets: {
        type: [Number],
        required: [true]
    },
    burstLengthA: {
        type: [String],
        required: [true]
    },
    audioCodec: {
        type: [String],
        required: [true]
    },
    idASHR: {
        type: String,
        required: [true]
    },
    mosASHR: {
        type: [Number],
        required: [true]
    }
});

const AudioStreamingHR = mongoose.model('audioStreaimingHigherResolution', AudioStreamingHRSchema); // passing the name of the collecton in database
module.exports = AudioStreamingHR;