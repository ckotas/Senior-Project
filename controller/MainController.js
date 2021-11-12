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
    //console.log(event)
    
    
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
    //Get proper time format
    var startDateTime = req.body.edate + "T" + req.body.eSTime;
    var endDateTime = req.body.edate + "T" + req.body.eETime;
    
    //get day of week
    var dayofweek = new Date(startDateTime);
    var newday = dayofweek.getDay();
    console.log(newday);
 
    db.updateEvent(startDateTime, endDateTime, req.body.eColor, req.body.eTextcolor, newday.toString(), req.body.edate, req.body.eRecurDateend, req.body.eRepeat, req.body.eTitle, req.body.eDescription, req.body.eType, id);
    var event = db.getEvent(id);
    console.log(event);
    if (req.session.user.role === 'Student') {
        res.redirect('/student');
    } else if (req.session.user.role === 'RA') {
        res.redirect('/RA');
    }
};