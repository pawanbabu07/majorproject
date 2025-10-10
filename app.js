const express=require("express");
const mongoose=require("mongoose");
const path = require("path");
const methodOverride=require("method-override");
const ejsMate = require("ejs-mate");
const listingsRouters=require('./routes/listing.js');
const reviewsRouters=require('./routes/review.js');
const userRouters=require('./routes/user.js');
const session=require('express-session');
const flash=require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user.js');

const app = express();
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);


const sessionOptions={
    secret: "keybord",
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() +7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
    }
}

app.listen(8080,()=>{
    console.log("app is listen");
})

main().then(()=>{
    console.log("connection susscessful");
}).catch((err)=>{
    console.log(err);
});
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
} 

//Index route
app.get("/",(req,res)=>{
    res.redirect("/listings")
});

app.use(session(sessionOptions));
app.use(flash()); //flash use befor our routes
//user authentication method
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    res.locals.currUser=req.user;
    next();
})

app.use('/listings',listingsRouters);
app.use('/listings/:id/reviews',reviewsRouters);
app.use('/',userRouters);

app.use((err, req, res, next)=>{
    // let{statusCode = 500, message = "Somthing eont wrong!"}=err;
    // console.log(err);
    res.render("listings/error.ejs",{err});
});

