const User = require('../models/user.js');

//signup page
module.exports.signupForm=(req, res) => {
    res.render('users/signup.ejs');
}

//signup page
module.exports.SumitSignupForm=async (req, res) => {
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
};

//login page
module.exports.loginForm=(req,res)=>{
    res.render('users/login.ejs');
}

//login post requst
module.exports.sumitLoginPage=async(req,res)=>{
    req.flash('succuss',"welcom to wanderlust!");
    let redirectUrl = res.locals.redirectUrl || '/listings';   // ⚠️ line 41 likely
    res.redirect(redirectUrl);
}

//logout page
module.exports.logoutForm=(req,res,next)=>{
   req.logout((err)=>{
    if(err){
        return next(err);
    }
    req.flash('success','you are logged out!');
    res.redirect("/listings");
   })
}