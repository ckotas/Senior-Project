const express = require('express');
const controller = require('../controller/raController');

const router = express.Router();

router.get('/homepage', controller.homepage);

router.get('/inbox', controller.inbox);

router.get('/announcements', controller.anouncementRA);

router.post('/announcements', controller.anouncementRA);

router.get('/editAnnouncement', controller.editAnnouncement);

router.post('/going', controller.going);

router.get('/createEvent', controller.createEventRa);

router.post('/createEvent', controller.createdEventRa);

router.get('/logout', controller.logoutRA);

router.get('/message/:id', controller.viewMessage);

router.put('/updatemessage/:id', controller.updateMessage);

router.get('/CreateAnnouncementsRA', controller.CreateAnnouncementsRA);

router.post('/CreateAnnouncementsRA', controller.CreatedAnnouncementsRA);

router.get('/', controller.homepage);

module.exports = router;