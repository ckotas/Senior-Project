var express = require('express');
var app = express();
app.use('/assets', express.static('assets'));
var bodyParser = require('body-parser');
const mainRoutes = require('./routes/mainRoutes');
const studentRoutes = require('./routes/studentsRoutes');
const raRoutes = require('./routes/raRoutes');
const db = require('./database/database');
const methodOverride = require('method-override');

//db.createDatabase();
// db.createUser("FirstN1", "LastN1", "Student", "test1@test.com", "password", "1");
// db.createUser("FirstN2", "LastN2", "RA", "test2@test.com", "password", "1");
// db.createUser("FirstN", "LastN", "RA", "test3@test.com", "password", "2");


//configure app
let port = 3000;
let host = 'localhost';
app.set('view engine', 'ejs');



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
app.listen(port, host, ()=>{
    console.log('Server is running on port', port);
});