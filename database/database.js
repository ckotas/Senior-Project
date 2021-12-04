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
    CREATE TABLE "UserProfile"(
        "userId" TEXT,
        "announcements" TEXT 
    );
    CREATE TABLE "randomRM"(
        "roomId" TEXT,
        "eventId" TEXT,
        "rndmlist" TEXT,
        "endDate" TEXT ,
        "repeatType" TEXT 
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
        "Random" BOOL NOT NULL,
        FOREIGN KEY("creator") REFERENCES Users("userId")
    );
    CREATE TABLE "Message"(
        "messageId" TEXT PRIMARY KEY,
        "sender" TEXT NOT NULL,
        "roomId" INTEGER NOT NULL,
        "subject" TEXT NOT NULL,
        "message" TEXT NOT NULL,
        "anonymous" BOOL NOT NULL,
        "date" DATE NOT NULL,
        "time" TIME NOT NULL,
        "resolved" BOOL,
        "TA" TEXT,
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

exports.getUserid = (id) => {
    return db.get(sql`SELECT fName, lName FROM "Users" WHERE "userId" = ${id}`);
}

exports.addEvent = (start, end, backgroundColor, textColor, daysOfWeek, title, description, type, id, roomId, startRecur, endRecur, repeat, Random) => {
    var uniqueId = uid(15);
    if (startRecur && endRecur) {
        db.run(
            sql`INSERT INTO "Event" ("eventId","start","end" ,"url","backgroundColor","textColor","daysOfWeek","startRecur","endRecur","repeat","title","description","type","creator", "roomId", Random) VALUES
            (${uniqueId},${start},${end},${'./eventDetails/' + uniqueId},${backgroundColor},${textColor},${daysOfWeek},${startRecur},${endRecur},${repeat},${title},${description},${type}, ${id}, ${roomId}, ${Random})`
        );
    } else {
        db.run(
            sql`INSERT INTO "Event" ("eventId","start","end" ,"url","backgroundColor","textColor","daysOfWeek","repeat","title","description","type","creator", "roomId", Random) VALUES
            (${uniqueId},${start},${end},${'./eventDetails/' + uniqueId},${backgroundColor},${textColor},${daysOfWeek},${repeat},${title},${description},${type}, ${id}, ${roomId}, ${Random})`
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
exports.updateEvent = (start, end, backgroundColor, textColor, daysOfWeek, sRecur, eRecur, repeat, title, description, type, eventId, Random) => {
    db.run(
        sql`UPDATE "Event"
            SET "start" = ${start}, "end" = ${end}, "backgroundColor" = ${backgroundColor}, "textColor" = ${textColor},"daysOfWeek" = ${daysOfWeek}, 
            "startRecur" = ${sRecur}, "endRecur" = ${eRecur}, "repeat" = ${repeat}, "title" = ${title}, "description" = ${description}, "type" = ${type}, "Random" = ${Random}
            WHERE "eventId" = ${eventId}`
    )
};
exports.createMessage = (sender, roomId, subject, message, anonymous, date, time) => {
    let id = uid(16);
    db.run(
        sql`INSERT INTO "Message" ("messageId", "sender","roomId","subject", "message", "anonymous", "date", "time", "resolved") VALUES
            (${id},${sender},${roomId},${subject},${message},${anonymous},${date},${time}, ${0})`
    );
}
exports.getMessage = (messageId) => {
    return db.get(sql`SELECT * FROM "Message" WHERE "messageId" = ${messageId}`);
}

exports.getResolvedMessage = () => {
    return db.all(sql`SELECT * FROM "Message" WHERE "resolved" = ${1}`);
}

exports.getUnResolvedMessage = () => {
    return db.all(sql`SELECT * FROM "Message" WHERE "resolved" = ${0}`);
}

exports.updateMessage = (resolved, RA, id) => {
    db.run(
        sql`UPDATE "Message"
            SET "resolved" = ${resolved}, "TA" = ${RA}
            WHERE "messageID" = ${id}`
    )
};

exports.getAnnouncements = () => {
    return db.all(sql`SELECT * FROM "Event" WHERE "roomId" = ${0}`);
}

exports.deleteAnnouncement = (eventId) => {
    return db.run(sql`DELETE FROM "UserProfile" WHERE "announcements" = ${eventId}`);
}

exports.addtoUserProfile = (userId, announ) => {
    db.run(sql`INSERT INTO "UserProfile" ("userId", "announcements") VALUES (${userId}, ${announ})`);
};

exports.getGoing = (userId, announ) => {
    return db.all(sql`SELECT * FROM "UserProfile" WHERE "userId" = ${userId} and "announcements" = ${announ}`);
};

exports.getUserAnnouncemetns = (userId) => {
    return db.all(sql`SELECT "announcements" FROM "UserProfile" WHERE "userId" = ${userId}`);
};

exports.removeUserattending = (userId, announ) => {
    return db.run(sql`DELETE FROM "UserProfile" WHERE "userId" = ${userId} and announcements = ${announ}`);
}

exports.countOfEvent = (eventId) => {
    return db.get(sql`SELECT COUNT("userId") FROM "UserProfile" WHERE "announcements" = ${eventId}`);
}

exports.getRoomates = (roomId) => {
    return db.all(sql`SELECT * FROM "Users" WHERE "roomId" = ${roomId}`);
};

exports.addtoRngList = (roomId, eventId, rndmlist, endDate, repeatType) => {
    db.run(sql`INSERT INTO "randomRM" ("roomId", "eventId", "rndmlist", "endDate" , "repeatType") VALUES (${roomId}, ${eventId}, ${rndmlist}, ${endDate}, ${repeatType})`);
};

exports.checkRngList = (roomId, eventId) => {
    return db.all(sql`SELECT * FROM "randomRM" WHERE "roomId" = ${roomId} and "eventId" = ${eventId}`);
};

exports.deleteMessage = (messageId) => {
    return db.run(sql`DELETE FROM "Message" WHERE "messageId" = ${messageId}`);
}

exports.getStudents = () => {
    return db.all(sql`SELECT * FROM "Users"`);
}

exports.getStudent = (id) => {
    return db.get(sql`SELECT * FROM "Users" WHERE "userId" = ${id}`);
}

exports.updateStudent = (userId, fName, lName, role, email, roomId) => {
    db.run(
        sql`UPDATE "Users"
                SET "fName" = ${fName}, "lName" = ${lName}, "role" = ${role},"email" = ${email}, 
                 "roomId" = ${roomId}
                WHERE "userId" = ${userId}`
    )
};
exports.deleterdm = (eventId) => {
    return db.run(sql`DELETE FROM "randomRM" WHERE "eventId" = ${eventId}`);
}
exports.updaterdm = (roomId, eventId, rndmlist, endDate, repeatType) => {
    db.run(
        sql`UPDATE "randomRM"
                SET "rndmlist" = ${rndmlist}, "endDate" = ${endDate}, "repeatType" = ${repeatType}
                WHERE "roomId" = ${roomId} and "eventId" = ${eventId}`
    )
};