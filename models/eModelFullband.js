const mongoose =require('mongoose');
const Schema = mongoose.Schema;

// create eModelFullband Schema
const EModelFullbandSchema = new Schema({
    username: {
        type: String,
        required: [true],
        ref: "user"
    },
    absoluteDelay: {
        type: [Number],
        required: [true]
    },
    packetLossProb: {
        type: [Number],
        required: [true]
    },
    equipmentImpairmentFac: {
        type: [Number],
        required: [true]
    },
    packetLossImpairmentFac: {
        type: [Number],
        required: [true]
    },
    idEMF: {
        type: String,
        required: [true]
    },
    mosEMF: {
        type: [Number]
    }
});

const EModelFullband = mongoose.model('eModelFullband', EModelFullbandSchema); // passing the name of the collecton in database
module.exports = EModelFullband;