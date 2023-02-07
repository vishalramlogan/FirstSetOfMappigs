const mongoose =require('mongoose');
const Schema = mongoose.Schema;

// create eModelNarrowband Schema
const EModelNarrowbandSchema = new Schema({
    username: {
        type: String,
        required: [true],
        ref: "user"
    },
    electricCircuitNoise: {
        type: [Number],
        required: [true]
    },
    noiseFloor: {
        type: [Number],
        required: [true]
    },
    roomNoiseS: {
        type: [Number],
        required: [true]
    },
    roomNoiseR: {
        type: [Number],
        required: [true]
    },
    sLoudnessRating: {
        type: [Number],
        required: [true]
    },
    rLoudnessRating: {
        type: [Number],
        required: [true]
    },
    sidetoneMaskingRating: {
        type: [Number],
        required: [true]
    },
    dFactorR: {
        type: [Number],
        required: [true]
    },
    listnerSidetoneRating: {
        type: [Number],
        required: [true]
    },
    dFactorS: {
        type: [Number],
        required: [true]
    },
    classDelaySensitivity: {
        type: [String],
        required: [true]
    },
    meanOneWayDelay: {
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
    talkerEchoLoudness: {
        type: [Number],
        required: [true]
    },
    weightedEchoPathLoss: {
        type: [Number],
        required: [true]
    },
    qdu: {
        type: [Number],
        required: [true]
    },
    equipmentImpairmentFac: {
        type: [Number],
        required: [true]
    },
    packetLossRobustness: {
        type: [Number],
        required: [true]
    },
    packetLossProb: {
        type: [Number],
        required: [true]
    },
    burstRate: {
        type: [Number],
        required: [true]
    },
    advantageFactor: {
        type: [Number],
        required: [true]
    },
    idEMN: {
        type: String,
        required: [true]
    },
    mosEMN: {
        type: [Number]
    }
});

const EModelNarrowband = mongoose.model('eModelNarrowband', EModelNarrowbandSchema); // passing the name of the collecton in database
module.exports = EModelNarrowband;