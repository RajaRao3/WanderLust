if(process.env.NODE_ENV!= "production"){
    require('dotenv').config()
    //console.log(process.env.MAP_TOKEN)
}

const express  = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing_endpoint = require("./routes/listing.js");
const review_endpoint = require("./routes/review.js")
const user_endpoint = require("./routes/signUp.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");//  help us to create template
const port = 8001;
const session = require('express-session')
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const { schemaValidator, reviewValidator } = require("./schema.js");
app.engine('ejs', ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(path.join(__dirname,"/public")));
app.use(methodOverride("_method"));
const wrapAsync = require("./utils/wrapAsyc.js");
const ExpressError =require("./utils/ExpressError.js");
const Listing = require("./models/listing.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require(path.join(__dirname,'models','users'));

const { isLoggedIn, saveRedirectUrl } = require('./middleware');

const dbUrl = process.env.ATLASDB_URL;

// the below store   is used to store the  session information in the mongoAtlas
const store =  MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
    secret: process.env.SECRET
  },
  touchAfter:24*3600

});

store.on("err",()=>{
    console.log("Erro in MONGO sESSONS",err);

})

// creating sessionId
app.use(session({
    store,
    secret: process.env.SECRET,
   resave: false,
   saveUninitialized: true,
   cookie:{
     expires:Date.now() + 7*24*60*60* 1000,
     maxAge: 7*24*60*60* 1000,
     httpOnly:true
     
   }
 
}))


// to flash messages
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// generates a function used to store username and password in a a session is known as serialize

app.use((req, res, next) => {
    res.locals.currUser = req.user;

    //console.log(req.user);
    next();
  });
  



/*app.get("/demouser",async(req,res)=>{
    let fakeUser =  new User({
        email:"student@gmail.com",
        username:"mikle lavde",
        
    })

      let register =  await User.register(fakeUser,"helloword")hellow world is password
    console.log(register);
    res.send(register);


})*/
//const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";


async function main(){
     return await mongoose.connect(dbUrl);
}
main().then(()=>{
    console.log("sucessfullly connected to  database");
}).catch((e)=>{
    console.log("err",e);
})

app.listen(port,()=>{
    try{
        console.log(`server is running at port ${port}`);
    }catch(e){
        console.log("err",e);
    }
})

/*app.use((req,res,next)=>{
   
    next();
})*/

/*const isLoggedIn = (req,res,next)=>{
   // console.log(req.user) once you logged entire login info stored in req.user and logged  onto  console.
   //console.log(req.originalUrl);
    if(!req.isAuthenticated()){
        req.session.redirect = req.originalUrl;
        req.flash("err","you must be logged in to create new listing");
         return res.redirect("/login");
    }
        next();
    
}
*/

app.get("/listings/new",isLoggedIn,async(req,res)=>{
    
      res.render("./listings/new.ejs");

});
app.post("/search",wrapAsync(async(req,res)=>{
     let {search}  = req.body;
     Listing_countryWise = await Listing.find({country:search})
     if(Listing_countryWise.length==1){
          let id = Listing_countryWise[0]._id;
          res.redirect(`/Listing/${id}`);
     }else{
         res.render("./listings/search.ejs",{Listing_countryWise});
        
     }
    
}))


app.use("/Listing",Listing_endpoint);

app.use("/Listing/:id/reviews",review_endpoint);
app.use("/",user_endpoint)


/*app.post("/login",passport.authenticate('local',{failureRedirect:'/login'}),async(req,res)=>{
    res.redirect("/login");
})*/

app.all("*",(req,res,next)=>{// we are checking for all routes that if the routes are not found then send page not found
      throw new ExpressError(404,"Page not Found");
})

app.use((err,req,res,next)=>{
    let{statusCode =500,message = "internal server errror"} = err;
    res.status(statusCode).render("./listings/error.ejs",{message});
})

