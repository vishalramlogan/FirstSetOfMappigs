const mongoose =require('mongoose');
const Schema = mongoose.Schema;

// create eModelWideband Schema
const EModelWidebandSchema = new Schema({
    username: {
        type: String,
        required: [true],
        ref: "user"
    },
    meanOneWayDelay: {
        type: [Number],
        required: [true]
    },
    packetLossProb: {
        type: [Number],
        required: [true]
    },
    talkerEchoLoudRating: {
        type: [Number],
        required: [true]
    },
    equipmentImpairment: {
        type: [Number],
        required: [true]
    },
    absoluteDelay: {
        type: [Number],
        required: [true]
    },
    roundTripDelay: {
        type: [Number],
        required: [true]
    },
    weightedEchoPathLoss: {
        type: [Number],
        required: [true]
    },
    packetLossRobustness: {
        type: [Number],
        required: [true]
    },
    idEMW: {
        type: String,
        required: [true]
    },
    mosEMW: {
        type: [Number]
    }
});

const EModelWideband = mongoose.model('eModelWideband', EModelWidebandSchema); // passing the name of the collecton in database
module.exports = EModelWideband;