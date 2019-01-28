var express = require("express");
var router  = express.Router();
var ground = require("../models/ground");
var middleware = require("../middleware");

router.get("/grounds", function(req, res){
    ground.find({}, function(err, grounds){
       if(err){
           console.log(err);
       } else {
          res.render("grounds/index",{grounds:grounds});
       }
    });
    //res.render("grounds",{grounds:grounds});
    //res.render("grounds");
});

router.post("/grounds", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newGround = {name: name, image: image, description: desc, author: author};
    ground.create(newGround, function(err, newlyCreated){
        if(err)
        {
            console.log(err);
        } else 
        {
            res.redirect("/grounds");
        }
    });
    //res.send("wow, working.");
});

router.get("/grounds/new", middleware.isLoggedIn, function(req, res){
    res.render("grounds/new");
});

router.get("/grounds/:id", function(req, res){
    ground.findById(req.params.id).populate("comments").exec(function(err, foundGround){
        if(err || !foundGround)
        {
            req.flash("error", "ground not found!");
            res.redirect("back");
        } 
        else 
        {
            console.log(foundGround);
            res.render("grounds/show", {ground: foundGround});
        }
    });
})

// EDIT
router.get("/grounds/:id/edit", middleware.checkGroundOwnership, function(req, res){
    ground.findById(req.params.id, function(err, foundGround){
        if (err)
        {
            res.redirect("/grounds/" + req.params.id);
        }
        else
        {
            res.render("grounds/edit", {ground: foundGround});
        }
    });
});

// UPDATE
router.put("/grounds/:id",middleware.checkGroundOwnership, function(req, res){
    // find and update the correct campground
    ground.findByIdAndUpdate(req.params.id, req.body.ground, function(err, updatedGround){
       if(err)
       {
           res.redirect("/grounds");
       } 
       else 
       {
           //redirect somewhere(show page)
           res.redirect("/grounds/" + req.params.id);
       }
    });
});

// DESTROY
router.delete("/grounds/:id",middleware.checkGroundOwnership, function(req, res){
   ground.findByIdAndRemove(req.params.id, function(err){
      if(err)
      {
          res.redirect("/grounds");
      } 
      else 
      {
          res.redirect("/grounds");
      }
   });
});

module.exports = router;