const express = require('express');
const router = express.Router();
const authUser = require('../middleware/userAuth');
const eModelFullband = require('../controllers/eModelFullband');

//add a eModelFullband collection to database
router.post('/users/:username/eModelFullband',authUser,eModelFullband.EModelFullband_post);

module.exports = router;