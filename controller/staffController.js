const db = require('../database/database');
var { uid } = require('uid');

exports.homepage = (req, res) => {
    let roomId = req.session.user.roomId;
    let person = req.session.user.fName;
    let event = db.getEvents(roomId)
    //for showing announcements
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
                event[i].endRecur = endDate(event[i].endRecur);
                event[i].daysOfWeek = ['0', '1', '2', '3', '4', '5', '6']

            } else if (event[i].repeat === 'Weekly') {
                event[i].endRecur = endDate(event[i].endRecur);
                let temp = event[i].daysOfWeek;
                event[i].daysOfWeek = [temp];
            }
        }
    }
    res.render('HomePage', { event, person });
};

exports.inbox = (req, res) => {
    var resmess = db.getResolvedMessage();
    var unresmess = db.getUnResolvedMessage();

    if (resmess || unresmess) {
        res.render('InboxRA', { resmess, unresmess })
    } else {
        let err = new Error('Cannot find a event with id ' + id);
        err.status = 404;
        next(err);
    }
};