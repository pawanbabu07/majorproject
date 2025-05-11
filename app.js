const express=require("express");
const mongoose=require("mongoose");
const Listing= require("./models/listing.js");
const path = require("path");
const methodOverride=require("method-override");
const ejsMate = require("ejs-mate");

const app = express();
app.set("view engiine","ejs");
app.set("views",path.join(__dirname,"views"));
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



app.get("/",(req,res)=>{
    res.send("hii, i am pawan!");
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

//Home
app.post("/listings",async (req,res)=>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});

//show route
app.get("/listings/:id", async (req, res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
});

// Edite rout
app.get("/listings/:id/edit",async (req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
});

//update rout
app.put("/listings/:id", async (req,res)=>{
    let {id}= req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect("/listings");
} );

//Delete rout
app.delete("/listings/:id", async (req,res)=>{
    let {id}= req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});
