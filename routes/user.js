const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsyc.js");
const passport = require('passport');
const {saveRedirectUrl}=require('../middleware.js');
const userCollections=require('../controllers/user.js');

//signup page
router.get('/signup', userCollections.signupForm);

//signup page
router.post('/signup', wrapAsync(userCollections.SumitSignupForm)
);

//login page
router.get('/login',userCollections.loginForm);

//login post requst
router.post('/login',saveRedirectUrl, passport.authenticate('local',{failureRedirect:'/login',failureFlash:true}),userCollections.sumitLoginPage);

//logout page
router.get('/logout', userCollections.logoutForm)

module.exports = router;