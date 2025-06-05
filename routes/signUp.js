const express = require("express");
const app = express();
const router =  express.Router();
const path = require("path");
const flash = require('connect-flash');
const wrapAsync = require("../utils/wrapAsyc.js");
const { hashPassword, verifyPassword } = require("../utils/auth");

const User = require("../models/users.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
//const { resourceLimits } = require("worker_threads");



app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate));

const { isLoggedIn, saveRedirectUrl } = require('../middleware');


app.use(express.urlencoded({ extended: false }));
const signUpController = require("../controllers/signUp.js");

router.route("/signup").get(signUpController.signUp_form)
.post(wrapAsync(signUpController.post_signUp));


router.route("/login").get(signUpController.login_form)
.post(saveRedirectUrl,
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
  }),
  wrapAsync(signUpController.post_login));



router.get("/logout",(signUpController.logout));
//Passport exposes a logout() function on r"eq (also aliased as logOut()) that can be called from 
// any route handler which needs to terminate a login session.
//  Invoking logout() will remove the req.user property and clear the login session (if any).


module.exports = router;

