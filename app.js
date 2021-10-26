var express = require('express');
var app = express();
app.set('view engine', 'ejs');
app.use('/assets', express.static('assets'));
var bodyParser = require('body-parser');

//Establishing session and cookies
const session = require("express-session");
const cookieParser = require("cookie-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//setting the cookies
app.use(cookieParser());
app.use(
    session({
        secret: "testing",
        resave: false,
        saveUninitialized: true
    }));

    //Set variables for each controller
let maincontroller = require('./controller/maincontroller.js');

//route the corresponding urls to their controller
app.use('/about', maincontroller);
app.use('/Announcement', maincontroller);
app.use('/ContactUs', maincontroller);
app.use('/CreateAnnouncement', maincontroller);
app.use('/CreateEvent', maincontroller);
app.use('/CreateMessage', maincontroller);
app.use('/DailyView', maincontroller);
app.use('/Event_details', maincontroller);
app.use('/HomePage', maincontroller);
app.use('/Inbox', maincontroller);
app.use('/Login', maincontroller);
app.use('/ViewMessage', maincontroller);
app.use('/ViewMessage', maincontroller);
app.use('/Welcomepage', maincontroller);
app.use('/', maincontroller);



app.listen(8084);