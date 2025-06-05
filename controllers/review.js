const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const User = require("../models/users.js");

// post  review
module.exports.post_review = async(req,res)=>{
    let{id} = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body);
    console.log(req.user);
    newReview.author = req.user._id;
    console.log(newReview);


    await newReview.save();

    listing.reviews.push(newReview);

    await listing.save();
    res.redirect(`/Listing/${id}`);

}
// delete review

module.exports.delete_review = async(req,res)=>{
    const{id,reviewId} = req.params;
     await  Review.findByIdAndDelete(reviewId);
     await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
     res.redirect(`/Listing/${id}`);

}