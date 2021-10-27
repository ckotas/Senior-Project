const express = require('express');
const controller = require('../controller/studentsController');

const router = express.Router();

router.get('/homepage', controller.homepage);

router.get('/message', controller.message);

router.get('/announcements', controller.anouncement);

router.get('/createEvent', controller.createEvent);

router.get('/logout', controller.logout);


module.exports = router;