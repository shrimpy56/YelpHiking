var mongoose = require("mongoose");

var groundSchema = new mongoose.Schema({name:String, image:String, description: String,
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "user"
      },
      username: String
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "comment"
      }
   ]});
var ground = mongoose.model("ground", groundSchema);

module.exports = ground;