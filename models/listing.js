const { builtinModules } = require("module");
const mongoose = require("mongoose");
const Review = require("./review.js");
const { type } = require("os");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image: {
        type: String,
        default: "https://images.unsplash.com/photo-1415804941191-bc0c3bbac10d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bmF0dXJhbCUyMHdvbmRlciUyMG9mJTIwdGhlJTIwd29ybGR8ZW58MHx8MHx8fDA%3D",
        set: (v) => v === "" ? "https://images.unsplash.com/photo-1415804941191-bc0c3bbac10d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bmF0dXJhbCUyMHdvbmRlciUyMG9mJTIwdGhlJTIwd29ybGR8ZW58MHx8MHx8fDA%3D"
            : v,
    },
    price: Number,
    location: String,
    country: String,

    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ],

    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing; 