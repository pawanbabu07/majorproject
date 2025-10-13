const Listing=require('../models/listing.js');

//index route
module.exports.index= async (req, res)=>{
    const allListing = await Listing.find({});
    res.render("listings/index.ejs",{allListing});
}

//New route
module.exports.newForm=(req,res)=>{
    res.render("listings/new.ejs");
};

//create route
module.exports.renderNewForm=(async (req,res)=>{
    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
});

//show route
module.exports.showListing=async (req, res)=>{
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
};

// Edite rout
module.exports.editListing=async (req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requsted for does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
}

//update rout
module.exports.updateListng=async (req,res)=>{
    let {id}= req.params;
    let listing=await Listing.findById(id);
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success","Listing is updated!");
    res.redirect(`/listings/${id}`);
}

//Delete rout
module.exports.deleteListing=async (req,res)=>{
    let {id}= req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing is Deleted!");
    res.redirect("/listings");
}