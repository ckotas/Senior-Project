var express = require('express');
var app = express();
app.use('/assets', express.static('assets'));
var bodyParser = require('body-parser');
const mainRoutes = require('./routes/mainRoutes');
const studentRoutes = require('./routes/studentsRoutes');
const staffRoutes = require('./routes/staffRoutes');
const raRoutes = require('./routes/raRoutes');
const db = require('./database/database');
const methodOverride = require('method-override');

//  db.createDatabase();
// db.createUser("Aryani", "Patel ", "Student", "apate223@uncc.edu", "password", "1");
// db.createUser("Evette", "Hernandez", "Student", "eterhonh@uncc.edu", "password", "1");
// db.createUser("Adam", "Hill", "Student", "ahill113@uncc.edu", "password", "3");
// db.createUser("Austin", "Hill", "RA", "ahill112@uncc.edu", "password", "3");
// db.createUser("Christian", "Kotas", "staff", "ckotas@uncc.edu", "password", "7");
// db.createUser("Truong", "LastN", "RA", "tdang7@uncc.edu", "password", "5");


//configure app
let port = process.env.PORT || 3000;
//let host = 'localhost';
app.set('view engine', 'ejs');

app.use(express.static('public'))
app.use(express.urlencoded({extended: true}));




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
        saveUninitialized: true,
        cookie: {maxAge: 60*60*1000}
    }));

    app.use((req, res, next) => {
        
        res.locals.user = req.session.user||'null';
        
        next();
    });
    app.use(methodOverride('_method'));
//route the corresponding urls to their controller

app.use('/', mainRoutes);

app.use('/student', studentRoutes);

app.use('/RA', raRoutes);

app.use('/staff', staffRoutes);


app.use((req, res, next)=> {
    let err = new Error('Ther server cannot locate ' + req.url);
    err.status = 404;
    next(err);

});

app.use((err, req, res, next) =>{
    console.log(err.stack);
    if(!err.status){
        err.status = 500;
        err.message = ("Internal Server Error");
    }

    res.status(err.status);
    res.render('error', {error: err});
});

//start the server
app.listen(port, ()=>{
    console.log('Server is running on port', port);
});