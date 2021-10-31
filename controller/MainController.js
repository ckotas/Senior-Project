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

