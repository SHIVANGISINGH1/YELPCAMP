const User = require('../models/user');

module.exports.register = (req,res) => {
    res.render('user/register');
}

module.exports.registerNewUser = async(req,res,next) => {
    try {
        const {username,email,password} = req.body;
        const user = await new User({username,email});
        const registeredUser = await User.register(user,password);
        req.login(registeredUser, (err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp')
            res.redirect('/campgrounds');
        }))
        
    }
    catch(err) {
        req.flash('error', err.message);
        res.redirect('/register')
    }
}

module.exports.logIn = (req,res) => {
    res.render('user/login');
}

module.exports.logedInSuccess = (req,res) => {
    req.flash('success', 'Welcome back');
    console.log(req.originalUrl, 'dfsdfsdf')
    const sendto = req.session.returnTo || '/campgrounds'
    // console.log(req.session.returnTo, 'dfsdfsdf')
    // if (req.session.returnTo === '/favicon.ico') {
    //     console.log(req.session, 'Sssssssssssssssssss')
    //     res.redirect('/campgrounds');
    // }else
    res.redirect(sendto);
}

module.exports.logOut = (req,res) => {
    req.logout();
    req.flash('success' , 'loged out successfully');
    if (req.session.returnTo) {
        const sendto = req.session.returnTo;
        res.redirect(req.session.returnTo);
    }
    else {
        res.redirect('/campgrounds')
    }
    
}