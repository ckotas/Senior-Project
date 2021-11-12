const db = require('../database/database');
var moment = require('moment');
exports.welcome = (req, res) => {
    res.render('Welcomepage');
};

exports.about = (req, res) => {
    res.render('about');
};

exports.contact = (req, res) => {
    res.render('ContactUs');
};

exports.login = (req, res) => {
    res.render('login');
};
exports.eventDetails = (req, res, next) => {
    //req.param.id
    let id = req.params.id
    let event = db.getEvent(id)
    console.log(event)
    
    
        if (event){
            res.render('Event_details', {event, moment})
        } else {
            let err = new Error('Cannot find a event with id ' + id);
            err.status = 404;
            next(err);
        }
    
    
    
};

exports.loggingIn = (req, res) => {
    const db = require('../database/database');
    const user = db.getUser(req.body.email, req.body.password);

    if (user) {
        req.session.user = user;
        if (user.role === 'Student') {
            res.redirect('/student');
        } else if (user.role === 'RA') {
            res.redirect('/RA');
        }
    } else {
        res.redirect('/login');
    }
};

exports.delete = (req, res, next)=>{
    let id = req.params.id;


    db.deleteEvent(id)
    if (req.session.user.role === 'Student') {
        res.redirect('/student');
    } else if (req.session.user.role === 'RA') {
        res.redirect('/RA');
    }
};

exports.edit = (req, res, next)=>{
    let id = req.params.id;
    let event = db.getEvent(id)
    
    if (event){
        res.render('EditEvent', {event})
    } else {
        let err = new Error('Cannot find a event with id ' + id);
        err.status = 404;
        next(err);
    }
   
       
};

exports.update = (req, res, next)=>{
    let id = req.params.id;
    let event = db.getEvent(id);
    console.log("`````````````````````````````````````````");
    console.log(event);

    /*var sRecur;
    var eRecur;

    if(event.startRecur == null || event.endRecur == null){
        sRecur = 'null';
        eRecur = 'null';
    }else{
        sRecur = event.startRecur;
        eRecur = event.endRecur;
    }
    console.log(sRecur);*/

    //db.updateEvent(event.start, event.end, event.url, event.backgroundColor, event.textColor, event.daysOfWeek, 
        //sRecur, eRecur, event.repeat, event.title, event.description, event.type, event.eventId);
    if (req.session.user.role === 'Student') {
        res.redirect('/student');
    } else if (req.session.user.role === 'RA') {
        res.redirect('/RA');
    }
};