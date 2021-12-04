const express = require('express');
const controller = require('../controller/staffController');

const router = express.Router();

router.get('/homepage', controller.homepage);

router.get('/inbox', controller.inbox);

router.get('/announcements', controller.anouncementRA);

router.post('/announcements', controller.anouncementRA);

router.delete('/:id',  controller.deleteAnnouncement);

router.get('/:id/edit', controller.EditAnnouncementsRA);

router.post('/going/:id', controller.going);

router.delete('/removeAnnoun/:id', controller.removeAnnoun);

router.get('/createEvent', controller.createEventRa);

router.post('/createEvent', controller.createdEventRa);

router.get('/logout', controller.logoutRA);

router.get('/message/:id', controller.viewMessage);

router.post('/message/:id/delete', controller.removeMessage);

router.put('/updatemessage/:id', controller.updateMessage);

router.get('/CreateAnnouncementsRA', controller.CreateAnnouncementsRA);

router.get('/viewstudents', controller.viewstudents);

router.get('/newstudent', controller.newstudent);

router.post('/createstudent', controller.createstudent);

router.get('/updatestudent/:id', controller.updatestudent);

router.post('/updatestudent/:id', controller.updatestudents);

router.post('/CreateAnnouncementsRA', controller.CreatedAnnouncementsRA);

router.get('/', controller.homepage);

module.exports = router;