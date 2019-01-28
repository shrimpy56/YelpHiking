var express = require("express");
var router  = express.Router();
var passport = require("passport");
var user = require("../models/user");

router.get("/", function(req, res){
    res.render("landing");
    //res.send("wow, working.");
});

//  ===========
// AUTH ROUTES
//  ===========

router.get("/register", function(req, res){
   res.render("register"); 
});

router.post("/register", function(req, res){
    var newUser = new user({username: req.body.username});
    user.register(newUser, req.body.password, function(err, user){
        if(err){
            //console.log(err);
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpHiking " + user.username);
            res.redirect("/grounds"); 
        });
    });
});
// show login form
router.get("/login", function(req, res){
   res.render("login"); 
});
// handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/grounds",
        failureRedirect: "/login"
    }), function(req, res){
});
// logic route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Logged you out!");
   res.redirect("/grounds");
});

// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/login");
// }

module.exports = router;