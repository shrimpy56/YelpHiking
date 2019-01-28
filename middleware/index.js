var ground = require("../models/ground");
var comment = require("../models/comment");

// all the middleare goes here
var middlewareObj = {};

middlewareObj.checkGroundOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        ground.findById(req.params.id, function(err, foundGround){
           if(err || !foundGround){
               res.redirect("back");
           }  else {
               // does user own the campground?
            if(foundGround.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        comment.findById(req.params.comment_id, function(err, foundComment){
           if(err || !foundComment){
               req.flash("error", "comment not found");
               res.redirect("back");
           }  else {
               // does user own the comment?
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

module.exports = middlewareObj;