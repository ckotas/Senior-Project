exports.homepage = (req, res)=>{
    res.render('HomePage');
};

exports.inbox = (req, res)=>{
    res.render('inboxRA');
};

exports.anouncementRA = (req, res)=>{
    res.render('Announcements');
};

exports.editAnnouncement = (req, res)=>{
    
    res.render('CreateAnnouncementRA');
};

exports.going = (req, res)=>{
    res.redirect('homepage');
};

exports.createEventRa = (req, res)=>{
    res.render('CreateEvent');
};

exports.createdEventRa = (req, res)=>{
    res.redirect('homepage');
};

exports.logoutRA = (req, res)=>{
    req.session.user=undefined;
    res.redirect('../');
};

exports.CreateAnnouncementsRA = (req, res)=>{
    res.render('CreateAnnouncementRA');
};

exports.CreatedAnnouncementsRA = (req, res)=>{
    //set color
    res.redirect('homepage');
};

