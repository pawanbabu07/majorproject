const express=require("express");
const mongoose=require("mongoose");
const Listing= require("./models/listing.js");
const path = require("path");
const methodOverride=require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync=require("./utils/wrapAsyc.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema, reviewSchema}= require("./schema.js");
const Review= require("./models/review.js");

const app = express();
app.set("view engiine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);



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


const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMag=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMag);
    }else{
        next();
    }
};

const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMag=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMag);
    }else{
        next();
    }
};

app.get("/",(req,res)=>{
    res.redirect("/listings")
});

//Index route
app.get("/listings", async (req, res)=>{
    const allListing = await Listing.find({});
    res.render("listings/index.ejs",{allListing});
});

//New route
app.get("/listings/new", (req,res)=>{
    res.render("listings/new.ejs");
});

//create route
app.post("/listings",
    validateListing,
    wrapAsync(async (req,res)=>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

//show route
app.get("/listings/:id", 
    wrapAsync(async (req, res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
}));

// Edite rout
app.get("/listings/:id/edit",
    wrapAsync(async (req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

//update rout
app.put("/listings/:id", 
    validateListing,
    wrapAsync(async (req,res)=>{
    let {id}= req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect("/listings");
}));

//Delete rout
app.delete("/listings/:id", 
    wrapAsync(async (req,res)=>{
    let {id}= req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

//review rout
app.post("/listings/:id/reviews",
    validateReview, 
    wrapAsync(
    async(req, res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.review.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("rew review save");
    res.redirect(`/listings/${listing._id}`);
}));

// if no rout match 
// app.all("*", (req,res, next)=>{
//     next(new ExpressError(404, "Page Not found"));
// });

app.use((err, req, res, next)=>{
    // let{statusCode = 500, message = "Somthing eont wrong!"}=err;
    res.render("listings/error.ejs",{err});
});

