const express = require('express');
const controller = require('../controller/mainController');

const router = express.Router();

router.get('/', controller.welcome);

router.get('/about', controller.about);

router.get('/contact', controller.contact);

router.get('/login', controller.login);

router.get('/eventDetails/:id', controller.eventDetails);

router.post('/login', controller.loggingIn);

router.delete('/:id',  controller.delete);


module.exports = router;