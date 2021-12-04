const express = require('express');
const controller = require('../controller/staffController');

const router = express.Router();

router.get('/homepage', controller.homepage);

router.get('/inbox', controller.inbox);



module.exports = router;