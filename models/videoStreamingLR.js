const mongoose =require('mongoose');
const Schema = mongoose.Schema;

// create video streaming lower resolution Schema
const VideoStreamingLRSchema = new Schema({
    username: {
        type: String,
        required: [true],
        ref: "user"
    },
    packetLoss: {
        type: [String],
        required:  [true]
    },
    rebuffering: {
        type: [String],
        required:  [true]
    },
    videoWidth: {
        type: [Number],
        required:  [true]
    },
    videoHeight: {
        type: [Number],
        required:  [true]
    },
    videoPLC: {
        type: [String],
        required: [true]
    },
    rebufferingLength: {
        type: [Number],
        required: [true]
    },
    numRebufferingEvents: {
        type: [Number],
        required: [true]
    },
    rebufferingFactor: {
        type: [Number],
        required: [true]
    },
    numVideos: {
        type: [Number],
        required: [true]
    },
    videoContentCoding: {
        type: [Number],
        required: [true]
    },
    codingCompression: {
        type: [Number],
        required: [true]
    },
    measureTime: {
        type: [Number],
        required: [true]
    },
    ipPacketLoss: {
        type: [Number],
        required: [true]
    },
    ipPacketLossRate: {
        type: [Number],
        required: [true]
    },
    gopLength: {
        type: [Number],
        required: [true]
    },
    videoBitrate: {
        type: [Number],
        required: [true]
    },
    videoFrameRate: {
        type: [Number],
        required: [true]
    },
    idVSLR: {
        type: String,
        required: [true]
    },
    mosVSLR: {
        type: [Number]
    }
});

const VideoStreamingLR = mongoose.model('videoStreaimingLowerResolution', VideoStreamingLRSchema); 
module.exports = VideoStreamingLR;