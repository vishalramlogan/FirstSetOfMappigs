const mongoose =require('mongoose');
const Schema = mongoose.Schema;

// create video streaming higher resolution Schema
const VideoStreamingHRSchema = new Schema({
    username: {
        type: String,
        required: [true],
        ref: "user"
    },
    numPixelsPerVideo: {
        type: [Number],
        required:  [true]
    },
    videoResolution: {
        type: [String],
        required:  [true]
    },
    frameRate: {
        type: [Number],
        required:  [true]
    },
    sliceFrame: {
        type: [Number],
        required:  [true]
    },
    videoPLC: {
        type: [String],
        required:  [true]
    },
    lossMagnitude: {
        type: [Number],
        required: [true]
    },
    videoBitrate: {
        type: [Number],
        required: [true]
    },
    freezingRatio: {
        type: [Number],
        required: [true]
    },
    idVSHR: {
        type: String,
        required: [true]
    },
    mosVSHR: {
        type: [Number]
    }
});

const VideoStreamingHR = mongoose.model('videoStreaimingHigherResolution', VideoStreamingHRSchema); 
module.exports = VideoStreamingHR;