
import { catchAsyncError } from "./catchAsyncError.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";
import { User } from "../models/userSchema.js";

export const isAuthorized = catchAsyncError(async (req, res, next) => {
    const { token } = req.cookies;

    console.log("Token from cookies:", token); // Debug log

    if (!token) {
        return next(new ErrorHandler("User Not Authorized", 400));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = await User.findById(decoded.id);

        if (!req.user) {
            return next(new ErrorHandler("User not found", 404));
        }
    } catch (error) {
        return next(new ErrorHandler("Invalid or expired token", 401));
    }

    next();
});


