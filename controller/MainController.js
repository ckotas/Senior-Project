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
    if (event.repeat == "Daily") {
        var rndmlist = getrandomuser(id, req.session.user.roomId);
        rndmlist = JSON.stringify(rndmlist);
        if (db.checkRngList(id, req.session.user.roomId).length == 0) {
            db.addtoRngList(id, req.session.user.roomId, rndmlist)
        }

        var list = db.checkRngList(id, req.session.user.roomId);
        var list2 = JSON.parse(list[0].rndmlist);

        days = getdays(event.startRecur);
        days = Math.floor(days);
        if (list2.length > days) {
            days = list2[days];
        }
    }else if(event.repeat == "Weekly") {

    }
    console.log(days)
    var going;
    if (db.getGoing(req.session.user.userId, id).length == 0) {
        going = 0;
    } else {
        going = 1;
    }
    var count = db.countOfEvent(id);

    count = Object.values(count)[0];
    if (event) {
        res.render('Event_details', { event, moment, going, count, days })
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

exports.delete = (req, res, next) => {
    let id = req.params.id;


    db.deleteEvent(id)
    if (req.session.user.role === 'Student') {
        res.redirect('/student');
    } else if (req.session.user.role === 'RA') {
        res.redirect('/RA');
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
    //Get proper time format
    var startDateTime = req.body.edate + "T" + req.body.eSTime;
    var endDateTime = req.body.edate + "T" + req.body.eETime;

    //get day of week
    var dayofweek = new Date(startDateTime);
    var newday = dayofweek.getDay();

    var dayofweek2 = new Date(req.body.eRecurDateend);
    var endrecur = dayofweek2.getDate();
    dayofweek2.setDate(endrecur + 1);


    var date = dayofweek2.getUTCDate();
    var month = dayofweek2.getMonth();
    var year = dayofweek2.getFullYear();

    recur = (year) + "-" + (month + 1) + "-" + date;

    db.updateEvent(startDateTime, endDateTime, req.body.eColor, req.body.eTextcolor, newday.toString(), req.body.edate, recur, req.body.eRepeat, req.body.eTitle, req.body.eDescription, req.body.eType, id);

    if (req.session.user.role === 'Student') {
        res.redirect('/student');
    } else if (req.session.user.role === 'RA') {
        res.redirect('/RA');
    }
};

function getrandomuser(eventId, roomId) {
    var event = db.getEvent(eventId);
    var date1 = new Date(event.startRecur);
    var date2 = new Date(event.endRecur);

    // To calculate the time difference of two dates
    var Difference_In_Time = date2.getTime() - date1.getTime();

    // To calculate the no. of days between two dates
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    let users = [];

    let roomates = db.getRoomates(roomId);

    for (var i = 0; i < Difference_In_Days; i++) {
        var rng = Math.floor(Math.random() * roomates.length);
        var name = roomates[rng].fName;
        var lname = roomates[rng].lName;
        users[i] = name + " " + lname;
    };
    return users;

};

function getdays(start) {
    var date1 = new Date(start);
    //needs to be changes for different days
    var date2 = new Date("2021-11-9");

    // To calculate the time difference of two dates
    var Difference_In_Time = date2.getTime() - date1.getTime();

    // To calculate the no. of days between two dates
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

    return Difference_In_Days;
};