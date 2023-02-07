const express = require('express');
const router = express.Router();
const authUser = require('../middleware/userAuth');
const eModelWideband = require('../controllers/eModelWideband');

//add a gaming collection to database
router.post('/users/:username/eModelWideband',authUser,eModelWideband.EmodeleWideband_post);

module.exports = router;