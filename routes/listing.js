const express=require('express');
const router=express.Router();
const wrapAsync=require("../utils/wrapAsyc.js");
const {isLoggedIn, isOwner, validateListing}=require('../middleware.js');
const listingController=require("../controllers/listing.js");
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

//index route
router
.route('/')
.get(wrapAsync(listingController.index))
// .post(
//     isLoggedIn,
//     validateListing,
//     wrapAsync(listingController.renderNewForm)
// );
.post(upload.single('listing[image]'),(req,res)=>{
    res.send(req.file);
})

//New route
router.get("/new",isLoggedIn, listingController.newForm);

//show route
router
.route('/:id')
.get(
    wrapAsync(listingController.showListing)
)
.put(
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingController.updateListng)
)
.delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.deleteListing)
);

// Edite rout
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.editListing)
);

module.exports=router;