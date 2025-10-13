const Listing= require("../models/listing.js");
const Review= require("../models/review.js");


module.exports.showReview=async(req, res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview = new Review(req.body.reviews);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New review created!");
    res.redirect(`/listings/${listing._id}`);
}

//review delete rout
module.exports.deleteReview=async(req,res)=>{
    let{id, viewId}=req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: viewId}});
    await Review.findByIdAndDelete(viewId);
    req.flash("success","Review is deleted!")
    res.redirect(`/listings/${id}`);
}