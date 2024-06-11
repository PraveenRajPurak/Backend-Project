import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { User } from "../models/user.mjs";
import jwt from "jsonwebtoken";

export const verifyToken = asyncHandler(async (req, res, next) => {

    try {
        const accessToken = res.cookies?.accessToken

        if (!accessToken) {
            return new ApiError(401, "Access Token not found")
        }

        const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)

        if (!decodedToken) {
            return new ApiError(401, "Invalid Access Token")
        }

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
        if (!user) {
            return new ApiError(401, "User not found")
        }

        req.user = user;

        next()

    }
    catch (error) {
        return new ApiError(500, "Something went wrong in Token Verification", error?.message
        )
    }
})