const express=require('express');
const router=express.Router();
const Listing= require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsyc.js");
const {isLoggedIn, isOwner, validateListing}=require('../middleware.js');
const listingController=require("../controllers/listing.js");

//index route
router.get("/", wrapAsync(listingController.index));

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
    .populate({
        path: "reviews",
        populate:{
            path: "author",
        },
    })
    .populate("owner");
    if(!listing){
        req.flash("error","Listing you requsted for does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}));

// Edite rout
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
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
    isOwner,
    validateListing,
    wrapAsync(async (req,res)=>{
    let {id}= req.params;
    let listing=await Listing.findById(id);
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success","Listing is updated!");
    res.redirect(`/listings/${id}`);
}));

//Delete rout
router.delete("/:id", 
    isLoggedIn,
    isOwner,
    wrapAsync(async (req,res)=>{
    let {id}= req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing is Deleted!");
    res.redirect("/listings");
}));




module.exports=router;