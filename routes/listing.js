const express = require("express");
const router =  express.Router();
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
const { isLoggedIn, saveRedirectUrl,isOwner } = require('../middleware');

const listingController = require("../controllers/listing.js");
const {storage} = require("../cloudConfig.js")
const multer  = require('multer')
const upload = multer({ storage })
const cloudinary = require('cloudinary').v2;



// show all listings

// show individula listings
router.get("/:id",wrapAsync(listingController.show));

// get a form moved to app.js
// validaton schema as middleware
const validatingSchema = (req,res,next)=>{
    const listing = req.body;
    const result = schemaValidator.validate(req.body);//whatever the data we got from the post request body, it vaidates(checks) with schemaValidator(a schema we defined)
    if(result.error){
        throw new ExpressError(404,result.error);
    }
    else{
        next();
    }
    
}

router.route("/").get(wrapAsync(listingController.index))
  .post(upload.single('image'),validatingSchema,wrapAsync(listingController.new_formData))
// entering new details in form  routing towards all listings
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
    
  



// rendering edit form
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.edit_form));

// edit route 
router.route("/:id").put(upload.single("image"),listingController.edited_data)
.delete(isLoggedIn,isOwner,wrapAsync(listingController.delete_listing))

module.exports = router;
