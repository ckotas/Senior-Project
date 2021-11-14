const db = require('../database/database');
var { uid } = require('uid');


exports.homepage = (req, res) => {
    let roomId = req.session.user.roomId;
    let person = req.session.user.fName

    let event = db.getEvents(roomId)

    let announ = db.getUserAnnouncemetns(req.session.user.userId);

     for(var x=0; x< announ.length; x++){

        event.push(db.getEvent(announ[x].announcements)); 
       
     }  

    if (event == undefined) {

    } else {
        for (let i = 0; i < event.length; i++) {
            if (event[i].repeat === 'None') {
                delete event[i].daysOfWeek
                delete event[i].startRecur
                delete event[i].endRecur
            } else if (event[i].repeat === 'Daily') {
                event[i].daysOfWeek = ['0', '1', '2', '3', '4', '5', '6']

            } else if (event.repeat === 'Weekly') {
                let temp = event[i].daysOfWeek;
                event[i].daysOfWeek = [temp];
            }

        }
        //console.log(event)
    }


    res.render('HomePage', { event, person});
};

exports.message = (req, res) => {
    res.render('CreateMessage');
};

exports.createMessage = (req, res) => {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var anon = 0;
    if(req.body.anonymous == "yes"){
        anon = 1;
    }
    db.createMessage(req.session.user.userId, req.session.user.roomId, req.body.messagesubject, req.body.details, anon, date, time);
    if (req.session.user.role === 'Student') {
        res.redirect('/student');
    } else if (req.session.user.role === 'RA') {
        res.redirect('/RA');
    }
};

exports.anouncement = (req, res) => {
    let announ = db.getAnnouncements();

    res.render('Announcements',{announ});
};

exports.going = (req, res) => {
    let id = req.params.id
    var user = req.session.user.userId;
    console.log(db.getGoing(user, id))
    if( db.getGoing(user, id).length == 0){
        db.addtoUserProfile(user, id);
    }

    res.redirect('/student');
};

exports.removeAnnoun = (req, res) => {
    let id = req.params.id
    var user = req.session.user.userId;
    db.removeUserattending(user, id);
    res.redirect('/student');
};

exports.createEvent = (req, res) => {

    res.render('CreateEvent');
};

exports.createdEvent = (req, res) => {
    //console.log(req.body);
    //Get proper time format
    var startDateTime = req.body.edate + "T" + req.body.eSTime;
    var endDateTime = req.body.edate + "T" + req.body.eETime;

    //get day of week
    var dayofweek = new Date(startDateTime);
    var day = dayofweek.getDay();
    
    var dayofweek2 = new Date(req.body.eRecurDateend);
    var endrecur = dayofweek2.getDate();
    dayofweek2.setDate(endrecur + 1);
    

    var date =dayofweek2.getUTCDate();
    var month = dayofweek2.getMonth();
    var year =dayofweek2.getFullYear();

    recur = (year) + "-" + (month+1) + "-" + date; 

    db.addEvent(startDateTime, endDateTime, req.body.eColor, req.body.eTextcolor, day.toString(), req.body.eTitle, req.body.eDescription, req.body.eType, req.session.user.userId, req.session.user.roomId, req.body.edate, recur, req.body.eRepeat)
    res.redirect('/student');
};

exports.logout = (req, res) => {
    req.session.user = undefined;
    res.redirect('../');
};