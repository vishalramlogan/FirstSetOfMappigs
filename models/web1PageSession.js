const mongoose =require('mongoose');
const Schema = mongoose.Schema;

// create web1PageSession Schema
const Web1PageSessionSchema = new Schema({
    username: {
        type: String,
        required: [true],
        ref: "user"
    },
    expectedSessionTime1PS: {
        type: [Number],
        required: [true]
    },
    sessionTime1PS: {
        type: [Number],
        required: [true]
    },
    idW1PS: {
        type: String,
        required: [true]
    },
    mosW1PS: {
        type: [Number],
        required: [true]
    }
});

const Web1PageSession = mongoose.model('web1PageSession', Web1PageSessionSchema);
module.exports = Web1PageSession;