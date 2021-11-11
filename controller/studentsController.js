const db = require('../database/database');
var {uid} = require('uid');
    

exports.homepage = (req, res) => {
    let roomId = req.session.user.roomId
    
    let event = db.getEvents(roomId)
    if(event == undefined){

    } else {
    if (event.repeat === 'None'){
        delete event.daysOfWeek
    } else if (event.repeat === 'Daily'){
        event.daysOfWeek = ['0','1','2','3','4','5','6']
        
    }else if (event.repeat === 'Weekly'){
        let temp = event.daysOfWeek;
        event.daysOfWeek = [temp];
    }
    console.log(event)
    
}
      
      
    res.render('HomePage', {event});
};

exports.message = (req, res) => {
    res.render('CreateMessage');
};

exports.createMessage = (req, res) => {
    res.render('HomePage');
};

exports.anouncement = (req, res) => {
    res.render('Announcements');
};

exports.going = (req, res) => {
    res.redirect('HomePage');
};

exports.createEvent = (req, res) => {

    res.render('CreateEvent');
};

exports.createdEvent = (req, res) => {
    console.log(req.body);
    //Get proper time format
    var startDateTime = req.body.edate + "T" + req.body.eSTime + ":00";
    var endDateTime = req.body.edate + "T" + req.body.eETime + ":00";
    
    //get day of week
    const dayofweek = new Date(startDateTime);
    const day = dayofweek.getDay();

    db.addEvent(startDateTime, endDateTime, req.body.eColor, req.body.eTextcolor, day.toString(), req.body.eTitle, req.body.eDescription, req.body.eType, req.session.user.userId, req.session.user.roomId, req.body.edate, req.body.eRecurDateend, req.body.eRepeat)
    res.redirect('HomePage');
};

exports.logout = (req, res) => {
    req.session.user = undefined;
    res.redirect('../');
};