const express = require('express');
const router = express.Router();


router.get('/HomePage',function (req, res){
    res.render('homepage');
});
router.get('/Announcement',function (req, res){
    res.render('Announcements');
});
router.get('/DailyView',function (req, res){
    res.render('DailyView');
});
router.get('/login',function (req, res){
    res.render('Login');
});

module.exports = router;