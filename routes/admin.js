const express = require('express');
const router = express.Router();

const adminController = require('../controller/admin');

router.get('/trending', adminController.getTrending);
router.post('/trending', adminController.postTrending);

module.exports = router;