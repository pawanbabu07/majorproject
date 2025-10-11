const Listing=require('./models/listing');
const Review=require('./models/review.js');
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema}= require("./schema.js");
const {reviewSchema}= require("./schema.js");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner= async(req,res,next)=>{
    let {id}= req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash('error',"you are not the owner of listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMag=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMag);
    }else{
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body,{convert: true});
    if(error){
        let errMag=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMag);
    }else{
        next();
    }
};

module.exports.isReviewAuthor= async(req,res,next)=>{
    let {id,viewId}= req.params;
    let review=await Review.findById(viewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash('error',"you are not the outher of review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}