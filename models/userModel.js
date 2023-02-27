const mongoose = require("mongoose");
// const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const crypto = require("crypto");
// const dotenv = require('dotenv');




const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter your Name"],
  },
  age: {
    type: Number,

  },
  phone: {
    type: Number,

    minLength: [10, "Mobile Number should have 10 charectors"],
  },
  password: {
    type: String,
    // minLength: [8, "Password should have more than 8 charectors"],
    select: false,
  },
  avatar: [
    {
      public_id: {
        type: String,


      },
      url: {
        type: String,


      },
    }],


  role: {
    type: String,
  },
  clubName: {
    type: String,

  },
  description: {
    type: String,
  },
  position: {
    type: String,
  },

  joinedOn: {
    type: Date,
    default: Date.now()

  },

})





userSchema.pre("save", async function (next) {

  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

//JWT TOKEN
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  })
}

//Compare Password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)

};




module.exports = mongoose.model("user", userSchema);
