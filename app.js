var express = require('express');
var app = express();
app.set('view engine', 'ejs');
app.use('/assets', express.static('assets'));
var bodyParser = require('body-parser');
const {Database, sql } = require("@leafac/sqlite");

//Creates Database-uncomment if you don't have the "Drom-Buddy.db" file
const db = new Database("Drom-Buddy.db");
db.execute(sql`
        CREATE TABLE "Users"(
            "userId" INTEGER PRIMARY KEY AUTOINCREMENT,
            "fName" TEXT NOT NULL,
            "lName" TEXT NOT NULL,
            "role" TEXT NOT NULL,
            "email" TEXT NOT NULL,
            "roomId" INTEGER,
            FOREIGN KEY("roomId") REFERENCES "Room"("roomId")
        );
        CREATE TABLE "Announcement"(
            "announcementId" INTEGER PRIMARY KEY AUTOINCREMENT,
            "organizer" INTEGER NOT NULL,
            "title" TEXT NOT NULL,
            "type" TEXT NOT NULL,
            "date" DATE NOT NULL,
            "color" TEXT NOT NULL,
            "sTime" TIME NOT NULL,
            "eTime" TIME NOT NULL,
            "all-day" BOOl NOT NULL,
            "repeat" BOOl NOT NULL,
            "description" TEXT NOT NULL,
            FOREIGN KEY("organizer") REFERENCES Users("userId")
        );
        CREATE TABLE "Room"(
            "roomId" INTEGER PRIMARY KEY AUTOINCREMENT,
            "userId" VARCHAR,
            "plannerId" VARCHAR
        );
        CREATE TABLE "Planner"(
            "plannerId" INTEGER PRIMARY KEY AUTOINCREMENT,
            "roomId" INTEGER NOT NULL,
            "date" DATE NOT NULL,
            "time" TIME NOT NULL,
            "message" TEXT,
            FOREIGN KEY("roomId") REFERENCES Room("roomId")
        );
        CREATE TABLE "Event"(
            "eventId" INTEGER PRIMARY KEY AUTOINCREMENT,
            "attendees" VARCHAR NOT NULL,
            "organizer" INTEGER NOT NULL,
            "date" DATE NOT NULL,
            "time" TIME NOT NULL,
            "location" TEXT NOT NULL,
            "details" TEXT NOT NULL,
            FOREIGN KEY("organizer") REFERENCES Users("userId")
        );
        CREATE TABLE "Message"(
            "messageId" INTEGER PRIMARY KEY AUTOINCREMENT,
            "recipient" INTEGER NOT NULL,
            "sender" INTEGER NOT NULL,
            "date" DATE NOT NULL,
            "time" TIME NOT NULL,
            "read" BOOl NOT NULL,
            "anonymous" BOOL NOT NULL, 
            "message" TEXT NOT NULL,
            FOREIGN KEY("recipient") REFERENCES Users("userId"),
            FOREIGN KEY("sender") REFERENCES Users("userId")
        );
        `);

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