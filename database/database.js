const { Database, sql } = require("@leafac/sqlite");
const { uid } = require("uid");


const db = new Database("Drom-Buddy.db");

//Creates database only run if there is not a "Dorm-Buddy.db" file
exports.createDatabase = () => {
    db.execute(sql`
    CREATE TABLE "Users"(
        "userId" TEXT PRIMARY KEY,
        "fName" TEXT NOT NULL,
        "lName" TEXT NOT NULL,
        "role" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "password" TEXT NOT NULL,
        "roomId" INTEGER
        
    );
    CREATE TABLE "Announcement"(
        "announcementId" TEXT PRIMARY KEY,
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
    
    CREATE TABLE "Planner"(
        "plannerId" INTEGER PRIMARY KEY AUTOINCREMENT,
        "roomId" INTEGER NOT NULL,
        "date" DATE NOT NULL,
        "time" TIME NOT NULL,
        "message" TEXT
        
    );
    CREATE TABLE "Event"(
        "eventId" TEXT PRIMARY KEY,
        "start" TEXT NOT NULL,
        "end" TEXT NOT NULL,
        "url" TEXT NOT NULL,
        "backgroundColor" TEXT NOT NULL,
        "textColor" TEXT NOT NULL,
        "daysOfWeek" TEXT,
        "startRecur" TEXT,
        "endRecur" TEXT,
        "repeat" TEXT,
        "title" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "roomId" INTEGER NOT NULL,
        "creator" INTEGER NOT NULL,
        
        FOREIGN KEY("creator") REFERENCES Users("userId")
    );
    CREATE TABLE "Message"(
        "messageId" INTEGER PRIMARY KEY,
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
    
}



//Function mostly for testing and debugging purposes to easily insert more test data into user database
exports.createUser = (fname, lname, role, email, password, roomId) => {
    let id = uid(16);
    db.run(
        sql`INSERT INTO "Users" ("userId", "fName", "lName", "role", "email", "password", "roomId") VALUES (${id},${fname}, ${lname}, ${role},${email},${password}, ${roomId})`
    );
};

exports.getUser = (email, password) => {
    return db.get(sql`SELECT * FROM "Users" WHERE "email" = ${email} and "password" = ${password} `);
}

exports.addEvent = (start, end, backgroundColor, textColor, daysOfWeek, title, description, type, id, roomId, startRecur, endRecur, repeat) => {
    var uniqueId = uid(15);
    if (startRecur && endRecur) {
        db.run(
            sql`INSERT INTO "Event" ("eventId","start","end" ,"url","backgroundColor","textColor","daysOfWeek","startRecur","endRecur","repeat","title","description","type","creator", "roomId") VALUES
            (${uniqueId},${start},${end},${'./eventDetails/'+ uniqueId},${backgroundColor},${textColor},${daysOfWeek},${startRecur},${endRecur},${repeat},${title},${description},${type}, ${id}, ${roomId})`
        );
    } else {
        db.run(
            sql`INSERT INTO "Event" ("eventId","start","end" ,"url","backgroundColor","textColor","daysOfWeek","repeat","title","description","type","creator", "roomId") VALUES
            (${uniqueId},${start},${end},${'./eventDetails/'+ uniqueId},${backgroundColor},${textColor},${daysOfWeek},${repeat},${title},${description},${type}, ${id}, ${roomId})`
        );
    }
}
exports.getEvent = (eventId) => {
    return db.get(sql`SELECT * FROM "Event" WHERE "eventId" = ${eventId}`);
}
exports.deleteEvent = (eventId) => {
    return db.run(sql`DELETE FROM "Event" WHERE "eventId" = ${eventId}`);
}

exports.getEvents = (roomId) => {
    return db.all(sql`SELECT * FROM "Event" WHERE "roomId" = ${roomId}`);
}
exports.updateEvent = (start, end, backgroundColor, textColor, daysOfWeek, sRecur, eRecur, repeat, title, description, type, eventId)=>{
    db.run(
        sql`UPDATE "Event"
            SET "start" = ${start}, "end" = ${end}, "backgroundColor" = ${backgroundColor}, "textColor" = ${textColor},"daysOfWeek" = ${daysOfWeek}, 
            "startRecur" = ${sRecur}, "endRecur" = ${eRecur}, "repeat" = ${repeat}, "title" = ${title}, "description" = ${description}, "type" = ${type}
            WHERE "eventId" = ${eventId}`
    )
};
exports.createMessage = (sender, date, time, read, anonymous, message) => {
    let id = uid(16);
        db.run(
            sql`INSERT INTO "Message" ("id", "sender","date","time","read", "anonymous", "message) VALUES
            ()`
        );
   
}
