const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const wrapAsync = require("../utils/wrapAsyc.js");
const passport = require('passport');
const {saveRedirectUrl}=require('../middleware.js');

router.get('/signup', (req, res) => {
    res.render('users/signup.ejs');
})

//signup page

router.post('/signup', wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registerUser = await User.register(newUser, password);
        req.login(registerUser,(err)=>{
            if(err){
                return next(err);
            }
        })
        req.flash("success", "welcome to wanderlust");
        res.redirect('/listings');
    } catch (e) {
        req.flash("error", e.message);
        res.redirect('/signup');
    }
})
);

//login page

router.get('/login',(req,res)=>{
    res.render('users/login.ejs');
})

router.post('/login',saveRedirectUrl, passport.authenticate('local',{failureRedirect:'/login',failureFlash:true}),async(req,res)=>{
    req.flash('succuss',"welcom to wanderlust!");
    let redirectUrl = res.locals.redirectUrl || '/listings';   // ⚠️ line 41 likely
    res.redirect(redirectUrl);
})

//logout page
router.get('/logout',(req,res,next)=>{
   req.logout((err)=>{
    if(err){
        return next(err);
    }
    req.flash('success','you are logged out!');
    res.redirect("/listings");
   })
})

module.exports = router;