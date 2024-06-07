import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    isLowercase: true,
    validator(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is not valid");
      }
    },
  },
  password: {
    type: String,
    trim: true,
    minlength: true,
    required: true,
  },
  avatar: {
    type: String,
    required:true
  },
  role: {
    type: String,
    enum: ["author", "reader"],
    required:true
  },
});

// hash password using brypt

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    next();
  });

// compare password

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generatejwtToken = async function(){
    return jwt.sign({id:this._id}, process.env.JWT_SECRET_KEY)
}

export const User = mongoose.model("User", userSchema);
