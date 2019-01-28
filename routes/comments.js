var express = require("express");
var router  = express.Router();
var ground = require("../models/ground");
var comment = require("../models/comment");
var middleware = require("../middleware");

// ====================
// COMMENTS ROUTES
// ====================

router.get("/grounds/:id/comments/new", middleware.isLoggedIn, function(req, res){
    ground.findById(req.params.id, function(err, ground){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {ground: ground});
        }
    })
});

router.post("/grounds/:id/comments", middleware.isLoggedIn, function(req, res){
   ground.findById(req.params.id, function(err, ground){
       if(err){
           console.log(err);
           res.redirect("/grounds");
       } else {
        comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               comment.save();
               ground.comments.push(comment);
               ground.save();
               req.flash("success", "Successfully added comment");
               res.redirect('/grounds/' + ground._id);
           }
        });
       }
   });
});

// COMMENT EDIT ROUTE
router.get("/grounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
   comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
          res.redirect("back");
      } else {
        res.render("comments/edit", {ground_id: req.params.id, comment: foundComment});
      }
   });
});

// COMMENT UPDATE
router.put("/grounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
   comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
          res.redirect("back");
      } else {
          res.redirect("/grounds/" + req.params.id );
      }
   });
});

// COMMENT DESTROY ROUTE
router.delete("/grounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
    //findByIdAndRemove
    comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           req.flash("success", "Comment deleted");
           res.redirect("/grounds/" + req.params.id);
       }
    });
});

module.exports = router;