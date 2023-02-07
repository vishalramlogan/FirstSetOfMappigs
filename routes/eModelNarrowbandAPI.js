const express = require('express');
const router = express.Router();
const authUser = require('../middleware/userAuth');
const eModelNarrowband = require('../controllers/eModelNarrowband');

//add a EModelNarrowband collection to database
router.post('/users/:username/eModelNarrowband',authUser,eModelNarrowband.EModelNarrowband_post);

module.exports = router;