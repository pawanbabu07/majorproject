const express=require('express');
const router=express.Router();
const Listing= require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsyc.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema}= require("../schema.js");
const {isLoggedIn}=require('../middleware.js');
const mongoose=require("mongoose");


const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMag=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMag);
    }else{
        next();
    }
};

router.get("/", async (req, res)=>{
    const allListing = await Listing.find({});
    res.render("listings/index.ejs",{allListing});
});

//New route
router.get("/new",isLoggedIn, (req,res)=>{
    res.render("listings/new.ejs");
});

//create route
router.post("/",
    isLoggedIn,
    validateListing,
    wrapAsync(async (req,res)=>{
    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
}));

//show route
router.get("/:id", 
    wrapAsync(async (req, res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id)
    .populate("reviews")
    .populate("owner");
    if(!listing){
        req.flash("error","Listing you requsted for does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}));

// Edite rout
router.get("/:id/edit",isLoggedIn,
    wrapAsync(async (req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requsted for does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
}));

//update rout
router.put("/:id", 
    isLoggedIn,
    validateListing,
    wrapAsync(async (req,res)=>{
    let {id}= req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success","Listing is updated!");
    res.redirect("/listings");
}));

//Delete rout
router.delete("/:id", isLoggedIn,
    wrapAsync(async (req,res)=>{
    let {id}= req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing is Deleted!");
    res.redirect("/listings");
}));




module.exports=router;