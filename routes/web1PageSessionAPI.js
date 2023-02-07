const express = require('express');
const router = express.Router();
const authUser = require('../middleware/userAuth');
const web1PagesSession = require('../controllers/web1PageSession');

//add a web1PageSession collection database
router.post('/users/:username/web1PageSession',authUser,web1PagesSession.Web1PageSession_post);
router.post('/users/:username/web1PageSession/ExpectedSA',authUser,web1PagesSession.Web1PageSessionExpectedSA_post);
router.post('/users/:username/web1PageSession/SessionSA',authUser,web1PagesSession.Web1PageSessionSessionSA_post);

module.exports = router;