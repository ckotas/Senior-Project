exports.homepage = (req, res)=>{
    res.render('homepage');
};

exports.message = (req, res)=>{
    res.render('CreateMessage');
};

exports.anouncement = (req, res)=>{
    res.render('Announcements');
};

exports.createEvent = (req, res)=>{
    res.render('CreateEvent');
};

exports.logout = (req, res)=>{
    res.render('Welcomepage');
};