const db = require('../database/database');

exports.homepage = (req, res)=>{
    res.render('HomePage');
};

exports.message = (req, res)=>{
    res.render('CreateMessage');
};

exports.createMessage = (req, res)=>{
    res.render('HomePage');
};

exports.anouncement = (req, res)=>{
    res.render('Announcements');
};

exports.going = (req, res)=>{
    res.redirect('HomePage');
};

exports.createEvent = (req, res)=>{
    
    res.render('CreateEvent');
};

exports.createdEvent = (req, res)=>{
    res.redirect('HomePage');
};

exports.logout = (req, res)=>{
    req.session.user=undefined;
    res.redirect('../');
};