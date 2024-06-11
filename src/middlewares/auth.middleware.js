import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.mjs";
import jwt from "jsonwebtoken";

export const verifyToken = asyncHandler(async (req, res, next) => {

    try {
        const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        console.log("Access Token: ", accessToken);

        if (!accessToken) {
            throw new ApiError(401, "Access Token not found")
        }

        const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)

        if (!decodedToken) {
            throw new ApiError(401, "Invalid Access Token")
        }

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        if (!user) {
            throw new ApiError(401, "User not found")
        }

        req.user = user;

        next()

    }
    catch (error) {
        throw new ApiError(500, "Something went wrong in Token Verification", error?.message
        )
    }
})