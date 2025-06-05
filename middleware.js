// Check if user is logged in
const Listing = require("./models/listing.js");
const Review= require("./models/review.js");

const isLoggedIn = (req, res, next) => {
        console.log(req.user);

    if (!req.isAuthenticated()) {
        
        req.session.redirect = req.originalUrl;
        req.flash("err", "You must be login");
        return res.redirect("/login");
    }
    next();
};

// Save redirect URL middleware
const saveRedirectUrl = (req, res, next) => {
    if (req.session.redirect) {
        res.locals.redirect = req.session.redirect;
         // after we login passport automaticlly deletes redirect stored in session  insted we  stored in locals so that
         // passport cannot access local variables
    }
    next();
};

const isOwner = async(req,res,next)=>{
    let { id } = req.params; // Un-commented to get id from URL params
        //let listing = req.body;
        let edit_author_per = await Listing.findById(id);
        if(res.locals.currUser && !edit_author_per.owner.equals(res.locals.currUser._id)){
            req.flash("owner","you dont have ownership");
            return res.redirect(`/Listing/${id}`);

        }
        next();
}


const isAuthor = async(req,res,next)=>{
    let {id,reviewId } = req.params; // Un-commented to get id from URL params
        //let listing = req.body;
        let review_authorization = await Review.findById(reviewId);
        if(res.locals.currUser && !review_authorization.author.equals(res.locals.currUser._id)){
            req.flash("owner","the review is not yours");
            return res.redirect(`/Listing/${id}`);

        }
        next();
}

// Export both functions properly
module.exports = {
    isLoggedIn,
    saveRedirectUrl,
    isOwner,
    isAuthor
};
