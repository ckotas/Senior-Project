const express = require('express');
const controller = require('../controller/studentsController');

const router = express.Router();

router.get('/homepage', controller.homepage);

router.get('/message', controller.message);

router.post('/CreateMessage', controller.createMessage);

router.get('/announcements', controller.anouncement);

router.post('/announcements', controller.going);

router.post('/going/:id', controller.going);

router.delete('/removeAnnoun/:id', controller.removeAnnoun);

router.get('/createEvent', controller.createEvent);

router.post('/createEvent', controller.createdEvent);

router.get('/logout', controller.logout);

router.get('/', controller.homepage);

module.exports = router;