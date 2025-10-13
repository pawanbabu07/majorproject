const express= require('express');
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsyc.js");
const {validateReview, isLoggedIn, isReviewAuthor}=require("../middleware.js");
const reviewControllers=require('../controllers/review.js');

//review show rout
router.post("/",
    isLoggedIn,
    validateReview, 
    wrapAsync(reviewControllers.showReview)
);

//review delete rout
router.delete("/:viewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewControllers.deleteReview)
);

module.exports=router;