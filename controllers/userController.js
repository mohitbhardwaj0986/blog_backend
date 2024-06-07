import { catchAsyncError } from "../middleware/catchAsync.js";
import ErrorHandler from "../middleware/errorHandler.js";
import { User } from "../models/user.medel.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { sendToken } from "../utils/jwtToken.js";

export const register = catchAsyncError(async (req, res, next) => {


  const avatarLocalPath = req.files?.avatar[0]?.path;

  if (!avatarLocalPath) {
    return next(new ErrorHandler("Avatar local file is required", 400));
  }

  let avatar;
  try {
    avatar = await uploadOnCloudinary(avatarLocalPath);
  } catch (error) {
    return next(new ErrorHandler("Failed to upload avatar to Cloudinary", 500));
  }

  const { name, email, password, role } = req.body;


  if (!name || !email || !password || !role) {
    return next(new ErrorHandler("Please enter all required fields", 400));
  }

  const isEmailTaken = await User.findOne({ email });

  if (isEmailTaken) {
    return next(new ErrorHandler("This email already exists", 400));
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    avatar: avatar.url,
  });

sendToken(user, 201,res, "user register successfully")
});

export const login = catchAsyncError(async (req, res, next) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return next(new ErrorHandler("Please enter all required fields", 400));
  }
  const user = await User.findOne({ email })
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }

  const isPasswordMatch = await user.comparePassword(password)
  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }

  if (user.role !== role) {
    return next(new ErrorHandler("please provide the role"))
  }
  sendToken(user, 201, res, "user login successfully")

})


export const logout = catchAsyncError(async (req, res, next) => {
  res.cookie("token", "", {
    expires: new Date(Date.now()),
    httpOnly: true,
    secure:true,
    sameSite:'None'
  });
  res.status(201).json({
    success: true,
    message: "user logout successfully",
  });
})


export const getUser = catchAsyncError(async (req, res, next)=>{
    const user = req.user;
    res.status(200).json({
        success:true,
        user
    })
})

export const allAuthor = catchAsyncError(async (req, res, next)=>{
    const authors = await User.find({role: "author"})
    res.status(200).json({
        success:true,
        authors
    })
})