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
            event[i].title = event[i].title.replace(/[^\w\s]/gi, '').trim();
            if (event[i].repeat === 'None') {
                delete event[i].daysOfWeek
                delete event[i].startRecur
                delete event[i].endRecur
            } else if (event[i].repeat === 'Daily') {
                event[i].endRecur = JSON.parse(endDate(event[i].endRecur));
                event[i].daysOfWeek = ['0', '1', '2', '3', '4', '5', '6']

            } else if (event[i].repeat === 'Weekly') {
                event[i].endRecur = JSON.parse(endDate(event[i].endRecur));
                let temp = event[i].daysOfWeek;
                event[i].daysOfWeek = [temp];
            }

        }
        
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
    //Get proper time format
    var Random = req.body.Random;
    var startDateTime = req.body.edate + "T" + req.body.eSTime + ":00";
    var endDateTime = req.body.edate + "T" + req.body.eETime + ":00";

    //get day of week
    var dayofweek = new Date(startDateTime);
    var day = dayofweek.getDay();
    
    if (checkDates(req.body.edate, req.body.eRecurDateend) < 0){
        req.body.eRecurDateend = req.body.edate;    
    }

    if (Random == null) {
        Random = 0;
    } else {
        Random = 1;
    }
    

    db.addEvent(startDateTime, endDateTime, req.body.eColor, req.body.eTextcolor, day.toString(), req.body.eTitle, req.body.eDescription, req.body.eType, req.session.user.userId, req.session.user.roomId, req.body.edate, req.body.eRecurDateend, req.body.eRepeat, Random)
    res.redirect('/student');
};

exports.logout = (req, res) => {
    req.session.user = undefined;
    res.redirect('../');
};


function endDate(end){

    var dayofweek2 = new Date(end);
    var endrecur = dayofweek2.getDate();
    dayofweek2.setDate(endrecur + 1); // keeps pushing the day out every time it is updated
    date = JSON.stringify(dayofweek2)
    date = date.split("T");
    
    date = date[0] + '"';
    
    
    
    return  date;
}
function checkDates(start , end) {
    var date1 = new Date(start);
    //needs to be changes for different days
    var date2 = new Date(end);

    // To calculate the time difference of two dates
    var Difference_In_Time = date2.getTime() - date1.getTime();

    // To calculate the no. of days between two dates
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

    return Difference_In_Days;
};