const express = require('express');
const middleware = require('../middleware');
const passport = require('passport');
const User = require('../models/user');
const router = express.Router();
const CatchAsync = require('../utils/CatchAsync');
const {register, registerNewUser, logIn, logedInSuccess, logOut} = require('../Controllers/user');

router.route('/register')
    .get(register)
    .post(CatchAsync(registerNewUser))


router.route('/login')
    .get(logIn)
    .post(passport.authenticate('local',{ failureFlash: true , failureRedirect: '/login'}),logedInSuccess)

router.get('/logout' , logOut)
module.exports = router;