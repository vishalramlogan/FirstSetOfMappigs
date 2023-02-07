const express = require('express');
const router = express.Router();
const authUser = require('../middleware/userAuth');
const webSingleTimingEvent = require('../controllers/webSingleTimingEvent');

//add a WebSingleTimingEvent collection database
router.post('/users/:username/webSingleTimingEvent',authUser,webSingleTimingEvent.WebSingleTimingEvent_post);
router.post('/users/:username/webSingleTimingEvent/ExpectedSessionSA',authUser,webSingleTimingEvent.WebSingleTimingEventExpectedSA_post);
router.post('/users/:username/webSingleTimingEvent/SessionSA',authUser,webSingleTimingEvent.WebSingleTimingEventSessionSA_post);

module.exports = router;