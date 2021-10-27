const express = require('express');
const controller = require('../controller/raController');

const router = express.Router();

router.get('/homepage', controller.homepage);

router.get('/message', controller.inbox);

router.get('/announcements', controller.anouncementRA);

router.get('/createEvent', controller.createEventRa);

router.get('/logout', controller.logoutRA);


module.exports = router;