const express = require("express");
const router =  express.Router({mergeParams:true});
const mongoose = require("mongoose");

const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");//  help us to create template
const port = 8001;
const { schemaValidator, reviewValidator } = require("../schema.js");
const wrapAsync = require("../utils/wrapAsyc.js");
const ExpressError =require("../utils/ExpressError.js");

const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

const { isLoggedIn,isAuthor } = require('../middleware.js');

const reviewController = require("../controllers/review.js");
//path specific middleware

const reviewform_validator = (req,res,next)=>{
    const {error}  = reviewValidator.validate(req.body);
    if(error){
        throw new ExpressError(404,error);
    }else{

        next();
    }
   

}

router.post("/",isLoggedIn,reviewform_validator, wrapAsync(reviewController.post_review))

router.delete("/:reviewId",isLoggedIn,isAuthor,wrapAsync(reviewController.delete_review));

module.exports =router;
