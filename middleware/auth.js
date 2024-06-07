import jwt from "jsonwebtoken"
import { User } from "../models/user.medel.js"
import ErrorHandler from "./errorHandler.js"
import {catchAsyncError} from "./catchAsync.js"

export const isAuthorized = catchAsyncError(async (req, res, next) => {
    const {token} = req.cookies;
    try {
        if (!token) {
            return next(new ErrorHandler("please login first" ,401))
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.user = await User.findById(decoded.id)
        next()
    } catch (error) {
        return next(new ErrorHandler("invalid token" , 401))
    }
})