const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    username: String,
    hash: String,
    googleID: String,
    role: {
      type: String,
      enum: ["Boss","Developer","TA","Student"],
      default: "Student"
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);