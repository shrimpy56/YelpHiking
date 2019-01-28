var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var ground  = require("./models/ground");
var seedDB = require("./seeds");
var comment = require("./models/comment");
var passport = require("passport");
var localStrategy = require("passport-local");
var user = require("./models/user");
var methodOverride = require("method-override");

//requring routes
var commentRoutes = require("./routes/comments"),
    groundRoutes = require("./routes/grounds"),
    indexRoutes = require("./routes/index");

mongoose.connect(process.env.MYDBURL, {useNewUrlParser: true});
//mongoose.connect("mongodb://localhost/yelp", {useNewUrlParser: true});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(flash());
app.use(methodOverride("_method"));
//seedDB();

//passport
app.use(require("express-session")({
    secret: "Yelp hiking project!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use(groundRoutes);
app.use(commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("yelp hiking server start!");
});