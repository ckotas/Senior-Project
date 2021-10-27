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