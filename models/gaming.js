const mongoose =require('mongoose');
const Schema = mongoose.Schema;

// create gaming Schema
const GamingSchema = new Schema({
    username: {
        type: String,
        required: [true],
        ref: "user"
    },
    bitrate: {
        type: [Number],
        required: [true],
    },
    numPixelsPerVideo: {
        type: [Number],
        required: [true],
    },
    packetLoss: {
        type: [Number],
        required: [true],
    },
    encodingFrameRate: {
        type: [Number],
        required: [true],
    },
    lossSensitivityClass: {
        type: [String],
        required: [true],
    },
    encodingComplexity: {
        type: [String],
        required: [true],
    },
    delay: {
        type: [Number],
        required: [true],
    },
    idG: {
        type: String,
        required: [true],
    },
    mosG: {
        type: [Number]
    }
});

const Gaming = mongoose.model('gaming', GamingSchema); // passing the name of the collecton in database
module.exports = Gaming;