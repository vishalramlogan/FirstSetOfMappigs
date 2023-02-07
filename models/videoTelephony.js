const mongoose =require('mongoose');
const Schema = mongoose.Schema;

// create videoTelephony Schema
const VideoTelephonySchema = new Schema({
    username: {
        type: String,
        required: [true],
        ref: "user"
    },
    videoPacketLoss: {
        type: [Number],
        required: [true]
    },
    videoFrameRate: {
        type: [Number],
        required: [true]
    },
    videoBitRate: {
        type: [Number],
        required: [true]
    },
    combinationVT: {
        type: [Number],
        required: [true]
    },
    idVT: {
        type: String,
        required: [true]
    },
    mosVT: {
        type: [Number]
    }
});

const VideoTelephony = mongoose.model('videoTelephony', VideoTelephonySchema); // passing the name of the collecton in database
module.exports = VideoTelephony;