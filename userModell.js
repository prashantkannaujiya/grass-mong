const mongoose = require("mongoose");
var url="mongodb://127.0.0.1:27017/grass";  
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    username: String,
    password: String,
    task:Array
  })
  var UserModel = mongoose.model("User",UserSchema);
  module.exports = UserModel;