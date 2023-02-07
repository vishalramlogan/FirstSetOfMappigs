const mongoose =require('mongoose');
const Schema = mongoose.Schema;

// create web2PageSession Schema
const Web2PageSessionSchema = new Schema({
    username: {
        type: String,
        required: [true],
        ref: "user"
    },
    expectedSessionTime2PS: {
        type: [Number],
        required: [true]
    },
    sessionTime2PS: {
        type: [Number],
        required: [true]
    },
    idW2PS: {
        type: String,
        required: [true]
    },
    mosW2PS: {
        type: [Number],
        required: [true]
    }
});

const Web2PageSession = mongoose.model('web2PageSession', Web2PageSessionSchema);
module.exports = Web2PageSession;