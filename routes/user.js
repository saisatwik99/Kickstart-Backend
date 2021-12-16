
const express = require('express');
const router = express.Router();
const verify = require('./verifyToken');

const userController = require('../controller/user');

router.post('/login', userController.login);
router.post('/signup', userController.signup);

module.exports = router;