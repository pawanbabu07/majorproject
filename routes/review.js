const express= require('express');
const router=express.Router({mergeParams:true});
const Listing= require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsyc.js");
const Review= require("../models/review.js");
const {validateReview, isLoggedIn, isReviewAuthor}=require("../middleware.js");


//review show rout
router.post("/",
    isLoggedIn,
    validateReview, 
    wrapAsync(
    async(req, res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview = new Review(req.body.reviews);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New review created!");
    res.redirect(`/listings/${listing._id}`);
}));

//review delete rout
router.delete("/:viewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(async(req,res)=>{
    let{id, viewId}=req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: viewId}});
    await Review.findByIdAndDelete(viewId);
    req.flash("success","Review is deleted!")
    res.redirect(`/listings/${id}`);
}))

module.exports=router;