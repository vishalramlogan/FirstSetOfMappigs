const mongoose =require('mongoose');
const Schema = mongoose.Schema;

// create audio streaing lower resolution Schema
const AudioStreamingLRSchema = new Schema({
    username: {
        type: String,
        required: [true],
        ref: "user"
    },
    audioBitrateLR: {
        type: [Number],
        required: [true]
    },
    audioFrameLength: {
        type: [Number],
        required: [true]
    },
    averageBurstIP: {
        type: [Number],
        required: [true]
    },
    maxSizeAudioStream: {
        type: [Number],
        required: [true]
    },
    lossRateIPPackets: {
        type: [Number],
        required: [true]
    },
    numAudioFrames: {
        type: [Number],
        required: [true]
    },
    audioCodec: {
        type: [String],
        required:  [true]
    },
    idASLR: {
        type: String,
        required:  [true]
    },
    mosASLR: {
        type: [Number]
    }
});

const AudioStreamingLR = mongoose.model('audioStreaimingLowerResolution', AudioStreamingLRSchema);
module.exports = AudioStreamingLR;