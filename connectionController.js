const express = require('express');
const router = express.Router();
const ConnectDB = require("../util/connectionDB");

//handles all requests related to connections
router.all('/connections', async function (req, res) {

    const connectionDB = new ConnectDB();
    let connections = await connectionDB.getConnections();
    //console.log(connections);
    var temparray = [];
    for (let x = 0; x < connections.length; x++) {
        if (!(temparray.includes(connections[x].eventType))) {
            temparray.push(connections[x].eventType);
        }
    }
    //console.log(temparray);
    if (req.session.userProfile) {
        res.render('connections', {
            data: connections,
            topics: temparray,
            thehost: req.session.userProfile.userid
        });
    } else {
        res.render('connections', { data: connections, topics: temparray });
    }
});

//handles all requests for a specific connection
router.all('/connection/:connectionID', async function (req, res) {

    let connectionID = req.params.connectionID;
    const connectionDB = new ConnectDB();
    let connection = await connectionDB.getConnection(connectionID);

    //console.log("You called this connection")
    //console.log(connection[0]);

    if (req.session.userProfile) {
        res.render('connection', {
            data: connection[0],
            thehost: req.session.userProfile.userid
        });
    } else {
        res.render('connection', { data: connection[0] });
    }

});

module.exports = router;