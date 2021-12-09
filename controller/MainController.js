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
    let id = req.params.id
    let event = db.getEvent(id)
    var days;
    var rnglist
    
    if (event.repeat == "Daily" && event.Random == 1) {  


        rnglist = db.checkRngList(req.session.user.roomId, id);
        
        if (rnglist.length == 0) {
            
            var rndmlist = getrandomuserdaily(id, req.session.user.roomId);
            rndmlist = JSON.stringify(rndmlist);
            db.addtoRngList(req.session.user.roomId, id, rndmlist, event.endRecur, event.repeat)
            rnglist = db.checkRngList(req.session.user.roomId, id);
        }
        rnglist = db.checkRngList(req.session.user.roomId, id);
        if (rnglist[0].endDate != event.endRecur || rnglist[0].repeatType != event.repeat){
            var rndmlist = getrandomuserdaily(id, req.session.user.roomId);
            rndmlist = JSON.stringify(rndmlist);
            db.updaterdm(req.session.user.roomId, id, rndmlist, event.endRecur, event.repeat)
            rnglist = db.checkRngList(req.session.user.roomId, id);
        }
        
        
        
        var list2 = JSON.parse(rnglist[0].rndmlist);

        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        today = yyyy + '-' + mm + '-' + dd;
        days = checkDates(event.startRecur, today);
        days = Math.floor(days);
        
        if (list2.length > days) {
            days = list2[days];
        }else {
            days =-1;
        }
    }else if(event.repeat == "Weekly" && event.Random == 1) {
        rnglist = db.checkRngList(req.session.user.roomId, id);
        
        if (rnglist.length == 0) {
            var rndmlist = getrandomuserweekly(id, req.session.user.roomId);
            rndmlist = JSON.stringify(rndmlist);
            db.addtoRngList(req.session.user.roomId, id, rndmlist, event.endRecur, event.repeat)
            rnglist = db.checkRngList(req.session.user.roomId, id);
        }
        rnglist = db.checkRngList(req.session.user.roomId, id);
        if (rnglist[0].endDate != event.endRecur || rnglist[0].repeatType != event.repeat){
            
            var rndmlist = getrandomuserweekly(id, req.session.user.roomId);
            rndmlist = JSON.stringify(rndmlist);
            db.updaterdm(req.session.user.roomId, id, rndmlist, event.endRecur, event.repeat)
            rnglist = db.checkRngList(req.session.user.roomId, id);
        }
        
        
        
        var list2 = JSON.parse(rnglist[0].rndmlist);

        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        today = yyyy + '-' + mm + '-' + dd;
        days = checkDates(event.startRecur, today);
        days = Math.floor(days/7);
        
        if (list2.length > days) {
            days = list2[days];
        }else {
            days =-1;
        }
    }

    var going;
    if (db.getGoing(req.session.user.userId, id).length == 0) {
        going = 0;
    } else {
        going = 1;
    }

    var count = db.countOfEvent(id);
    count = Object.values(count)[0];
    
    if (event) {
        res.render('Event_details', { event, moment, going, count, days})
        //add days for random
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
        }else if (user.role === 'staff') {
            res.redirect('/staff');
        }
    } else {
        res.redirect('/login');
    }
};

exports.delete = (req, res, next) => {
    let id = req.params.id;


    db.deleteEvent(id)
    db.deleterdm(id)
    if (req.session.user.role === 'Student') {
        res.redirect('/student');
    } else if (req.session.user.role === 'RA') {
        res.redirect('/RA');
    } else if (req.session.user.role === 'staff') {
        res.redirect('/staff');
    }
};

exports.edit = (req, res, next) => {
    let id = req.params.id;
    let event = db.getEvent(id)

    if (event) {
        res.render('EditEvent', { event })
    } else {
        let err = new Error('Cannot find a event with id ' + id);
        err.status = 404;
        next(err);
    }


};

exports.update = (req, res, next) => {
    let id = req.params.id;
    let event = db.getEvent(id)
    var Random = req.body.Random;
    //Get proper time format
    var startDateTime = req.body.edate + "T" + req.body.eSTime;
    var endDateTime = req.body.edate + "T" + req.body.eETime;

    //get day of week
    var dayofweek = new Date(startDateTime);
    var newday = dayofweek.getDay();
    if (checkDates(req.body.edate, req.body.eRecurDateend) < 0){
        req.body.eRecurDateend = req.body.edate;    
    }

    if (Random == null || event.roomId == 000) {
        Random = 0;
    } else {
        Random = 1;
    }

    db.updateEvent(startDateTime, endDateTime, req.body.eColor, req.body.eTextcolor, newday.toString(), req.body.edate, req.body.eRecurDateend, req.body.eRepeat, req.body.eTitle, req.body.eDescription, req.body.eType, id, Random);

    if (req.session.user.role === 'Student') {
        res.redirect('/student');
    } else if (req.session.user.role === 'RA') {
        res.redirect('/RA');
    } else if (req.session.user.role === 'staff') {
        res.redirect('/staff');
    }
};

function getrandomuserdaily(eventId, roomId) {
    var event = db.getEvent(eventId);
    var date1 = new Date(event.startRecur);
    var date2 = new Date(event.endRecur);

    // To calculate the time difference of two dates
    var Difference_In_Time = date2.getTime() - date1.getTime();

    // To calculate the no. of days between two dates
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    let users = [];

    let roomates = db.getRoomates(roomId);

    for (var i = 0; i < Difference_In_Days+1; i++) {
        var rng = Math.floor(Math.random() * roomates.length);
        var name = roomates[rng].fName;
        var lname = roomates[rng].lName;
        users[i] = name + " " + lname;
    };
    
    return users;

};

function getrandomuserweekly(eventId, roomId) {
    var event = db.getEvent(eventId);
    var date1 = new Date(event.startRecur);
    var date2 = new Date(event.endRecur);

    // To calculate the time difference of two dates
    var Difference_In_Time = date2.getTime() - date1.getTime();

    // To calculate the no. of days between two dates
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    let users = [];

    let roomates = db.getRoomates(roomId);

    for (var i = 0; i < (Math.floor(Difference_In_Days/7)+1); i++) {
        var rng = Math.floor(Math.random() * roomates.length);
        var name = roomates[rng].fName;
        var lname = roomates[rng].lName;
        users[i] = name + " " + lname;
    };
    return users;

};

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