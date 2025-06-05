// MVC  DESIGN PATTERN (model view controller)
const cloudinary = require('cloudinary').v2;
const Listing = require("../models/listing.js");
require('dotenv').config()
const mapToken = process.env.MAP_TOKEN;


const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken:mapToken});


// to show all listing
module.exports.index = async(req,res)=>{
 
    const allListings = await Listing.find({});
    res.locals.message = req.flash("success");
    res.locals.err = req.flash("err");
    res.locals.logout = req.flash("logger");
   
    res.render("./listings/index.ejs",{allListings});
}
// to show individual listings

module.exports.show = async(req,res)=>{
    let {id} = req.params;
    const data = await Listing.findById(id).populate({path:"reviews",populate:{
        path:"author"
    }}).populate("owner")
    const access_token = process.env.MAP_TOKEN;
    res.locals.ownership = req.flash("owner");
    res.render("./listings/show.ejs",{data,access_token});

}

// to create new listing

module.exports.new_formData = async(req,res)=>{
   let response  = await geocodingClient.forwardGeocode({
        query: req.body.location,
        limit: 2
      }).send();
    //console.log(response.body.features);//geometry ->
       

    let url = req.file.path;
    let filename = req.file.filename;
    //console.log(url, "",filename);
    const newListing  = new Listing(req.body);
    newListing.image = {url,filename};
     newListing.owner = req.user._id;
    newListing.geometry = response.body.features[0].geometry;
    let save = await newListing.save();
    console.log(save);
    req.flash('success', 'new listing is created');
    res.redirect("/Listing")
   
}
// rendering edit form

module.exports.edit_form = async(req,res)=>{
    let {id} = req.params;
    const listing =  await Listing.findById(id);
     let originalImage_url = listing.image.url;
     let transformed_image = originalImage_url.replace("/upload","/upload/ar_1.0,c_fill,w_50/r_max/f_auto/")
       
    res.render("./listings/edit.ejs",{listing,transformed_image});
}
module.exports.edited_data = async (req, res,next) => {
    try {
        let { id } = req.params; // Un-commented to get id from URL params
        let listing = req.body;
        const updatedListing = await Listing.findByIdAndUpdate(id, listing, { new: true, runValidators: true });
        if(typeof req.file != "undefined"){
            let url = req.file.path;
            let filename = req.file.filename;
            updatedListing.image = {url,filename};
            await updatedListing.save();

        }
        
        if (!updatedListing) {
            return next(new ExpressError(404,"LIST NOT FOUND"));
            
            //return res.status(404).json({ error: "Listing not found" });
        }

        res.redirect(`/Listing/${id}`);
    } catch (err) {
       // console.error("Error updating listing:", error);
            next(err);
        
        //res.status(500).json({ error: "Internal Server Error" });
    }
}
// delete listing

module.exports.delete_listing = async(req,res)=>{
    let {id} = req.params;
    await  Listing.findByIdAndDelete(id);
    res.redirect("/Listing");
}