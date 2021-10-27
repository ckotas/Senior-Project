exports.welcome = (req, res)=>{
    res.render('Welcomepage');
};

exports.about = (req, res)=>{
    res.render('about');
};

exports.contact = (req, res)=>{
    res.render('ContactUs');
};

exports.login = (req, res)=>{
    res.render('login');
};

exports.loggingIn = (req, res)=>{
    if(req.body.email === 'student'){
        res.redirect('/student');
    } else if(req.body.email === 'ra'){
        res.redirect('/RA');
    } else {
        res.redirect('/login');
    }
};

