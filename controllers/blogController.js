import { catchAsyncError } from "../middleware/catchAsync.js";
import ErrorHandler from "../middleware/errorHandler.js";
import { Blog } from "../models/blog.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const postBlog = catchAsyncError(async (req, res, next) => {
  const user = req.user;
  if (user.role === "reader") {
    return next(new ErrorHandler("You are not allowed to post", 403));
  }

  // Main image
  const mainImageLocalPath = req.files?.mainImage?.[0]?.path;
  if (!mainImageLocalPath) {
    return next(new ErrorHandler("Main image local file is required", 400));
  }

  let imageOneLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.imageOne) &&
    req.files.imageOne.length > 0
  ) {
    imageOneLocalPath = req.files.imageOne[0].path;
  }
  let imageTwoLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.imageTwo) &&
    req.files.imageTwo.length > 0
  ) {
    imageTwoLocalPath = req.files.imageTwo[0].path;
  }
  const mainImage = await uploadOnCloudinary(mainImageLocalPath);
  const imageOne = await uploadOnCloudinary(imageOneLocalPath);
  const imageTwo = await uploadOnCloudinary(imageTwoLocalPath);
  const { title, description, descriptionOne, descriptionTwo, isPublic } =
    req.body;
  if (!title || !description) {
    return next(new ErrorHandler("Please fill atleast title and description", 400));
  }

  const authorId = user._id;
  const authorName = user.name || "Anonymous";
  const authorAvatar = user.avatar || "Anonymous";
  const blog = await Blog.create({
    title,
    description,
    descriptionOne,
    descriptionTwo,
    isPublic,
    authorId,
    authorName,
    authorAvatar,
    mainImage: mainImage.url,
    imageOne: imageOne?.url || "",
    imageTwo: imageTwo?.url || "",
  });

  res.status(201).json({
    success: true,
    blog,
  });
});

export const getAllPost = catchAsyncError(async (req, res, next) => {
  const blogs = await Blog.find({ isPublic: true });
  res.status(200).json({
    success: true,
    blogs,
  });
});

export const getSinglePost = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const user = req.user;



  const blog = await Blog.findById(id);
  if (!blog) {
    return next(new ErrorHandler("Blog not found", 404));
  }

  res.status(200).json({
    success: true,
    blog,
  });
});

export const updateBlog = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const user = req.user;

  if (user.role !== "author") {
    return next(
      new ErrorHandler("You are not allowed to update this post", 403)
    );
  }

  const blog = await Blog.findById(id);
  if (!blog) {
    return next(new ErrorHandler("Blog not found", 404));
  }

  if (blog.authorId.toString() !== user._id.toString()) {
    return next(
      new ErrorHandler("You are not allowed to update this post", 403)
    );
  }


  let mainImage, imageOne, imageTwo;

  if (req.files?.mainImage?.[0]?.path) {
    mainImage = await uploadOnCloudinary(req.files.mainImage[0].path);
    blog.mainImage = mainImage.url;
  }

  if (req.files?.imageOne?.[0]?.path) {
    imageOne = await uploadOnCloudinary(req.files.imageOne[0].path);
    blog.imageOne = imageOne.url;
  }

  if (req.files?.imageTwo?.[0]?.path) {
    imageTwo = await uploadOnCloudinary(req.files.imageTwo[0].path);
    blog.imageTwo = imageTwo.url;
  }

  const { title, description, descriptionOne, descriptionTwo, isPublic } =
    req.body;

  if (title) blog.title = title;
  if (description) blog.description = description;
  if (descriptionOne) blog.descriptionOne = descriptionOne;
  if (descriptionTwo) blog.descriptionTwo = descriptionTwo;
  if (typeof isPublic !== "undefined") blog.isPublic = isPublic;

  await blog.save();

  res.status(200).json({
    success: true,
    message: "Updated successfully",
    blog,
  });
});

export const deleteBlog = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const user = req.user;


  let blog = await Blog.findById(id);
  if (!blog) {
    return next(new ErrorHandler("Blog not found", 404));
  }

  if (blog.authorId.toString() !== user._id.toString()) {
    return next(
      new ErrorHandler("You are not allowed to delete this post", 403)
    );
  }

  await Blog.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Deleted successfully",
  });
});


export const getMyPost = catchAsyncError(async (req, res, next) => {
  const blogs = await Blog.find({ authorId: req.user._id });
  if (!blogs) {
    return next(new ErrorHandler("Blog not found", 404));
  }
  res.status(200).json({
    success: true,
    blogs,
  });
})
export const privateBlogs= catchAsyncError(async (req, res, next)=>{
  const blogs = await Blog.find({ isPublic: false });
  if (!blogs) {
    return next(new ErrorHandler("Blog not found", 404));
  }
  res.status(200).json({
    success: true,
    blogs,
  });
})