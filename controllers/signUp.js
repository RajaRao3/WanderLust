const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const User = require("../models/users.js");


// get signUp
module.exports.signUp_form = (req,res)=>{
    res.locals.err = req.flash("error");// value stored in err  variable directly passed into ejs 
    res.render("./users/signup.ejs");
    
}

module.exports.post_signUp = async(req,res)=>{
    try{
        let{username,email,password} = req.body;
        let newUser = new User({username,email});
        const register = await User.register(newUser,password);
        req.login(register, (err)=>{//  passport.authenticate() middleware invokes req.login()
        //  automatically. This function is primarily used when users sign up, during which req.login()
        //  can be invoked to automatically log in the newly registered user.
        //NOTE remember--- When the login operation completes, user will be assigned to req.user.
          if (err){
            return next(err);

          }
          req.flash("success","welcome to WanderLust");  
          res.redirect("/Listing");
          
        });
        
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }


}

module.exports.login_form = (req,res)=>{
    res.locals.err = req.flash("err");
     res.render("./users/login.ejs");
  
}

module.exports.post_login = async(req, res) => {
         let redirectUrl = res.locals.redirect || "/Listing";
         if(redirectUrl.includes("/reviews")){
               const parts = redirectUrl.split("/");
               const listingIdIndex = parts.indexOf("Listing") + 1;
               const id =  parts[listingIdIndex];
               redirectUrl =  `/Listing/${id}`;
         }

        req.flash("success","welcome to WanderLust");      
        res.redirect(redirectUrl); // Redirect on successful login
}

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
         if(err){
           return next(err);
         }
         
         req.flash("logger","You are logged out!");
         res.redirect("/Listing");
    })
}