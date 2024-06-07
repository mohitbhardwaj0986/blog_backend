import { request } from "express";
import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  mainImage: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageOne: {
    type: String,
  },
  descriptionOne: {
    type: String,
  },
  imageTwo: {
    type: String,
  },
  descriptionTwo: {
    type: String,
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  authorName:{
    type:String,
  },
  authorAvatar:{
    type:String,
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export const Blog = mongoose.model("Blog", blogSchema);
