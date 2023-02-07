const mongoose =require('mongoose');
const Schema = mongoose.Schema;

// create webSingleTimingEvent Schema
const WebSingleTimingEventSchema = new Schema({
    username: {
        type: String,
        required: [true],
        ref: "user"
    },
    expectedSessionTimeSTE: {
        type: [Number],
        required: [true]
    },
    sessionTimeSTE: {
        type: [Number],
        required: [true]
    },
    idWSTE: {
        type: String,
        required: [true]
    },
    mosWSTE: {
        type: [Number]
    }
});

const WebSingleTimingEvent = mongoose.model('webSingleTimingEvent', WebSingleTimingEventSchema);
module.exports = WebSingleTimingEvent;