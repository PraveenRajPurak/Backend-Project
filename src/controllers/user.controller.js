import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.mjs";
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import jwt from "jsonwebtoken";
const generateAccessAndRefressToken = async (userId) => {
    try {
        const user = await User.findById(userId);

        console.log("User : ", user);

        const accessToken = user.GenerateAccessToken()
        const refreshToken = user.GenerateRefreshToken()

        console.log("Access Token: ", accessToken);
        console.log("Refresh Token: ", refreshToken);

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken };
    }
    catch (error) {
        return new ApiError(500, "Something went wrong in Token Creation", error)
    }
}

const registerUser = asyncHandler(async (req, res, next) => {

    const { username, email, fullname, password } = req.body;
    console.log("Username : ", username);
    console.log("Email : ", email);
    console.log("Fullname : ", fullname);
    console.log("Password : ", password);

    if ([username, email, fullname, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const userExist = await User.findOne({
        $or: [{ email }, { username }]
    })

    if (userExist) {
        throw new ApiError(400, "User already exists");
    }

    const avatarlocalpath = req.files?.avatar[0]?.path

    console.log("\n Avatar Image Local Path : ", avatarlocalpath);
    //  const coverimagelocalpath = req.files?.coverImage[0]?.path

    let coverimagelocalpath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverimagelocalpath = req.files.coverImage[0].path;
    }

    console.log("\n Cover Image Local Path : ", coverimagelocalpath);

    if (!avatarlocalpath) {
        throw new ApiError(400, "Please upload your avatar! It is necessary!!");
    }

    const avatar = await uploadOnCloudinary(avatarlocalpath)
    const coverImage = await uploadOnCloudinary(coverimagelocalpath)

    console.log("\n Avatar (Cloudinary): ", avatar);
    console.log("\n Cover Image (Cloudinary) : ", coverImage);

    if (!avatar) {
        throw new ApiError(400, "Avatar not uploaded on cloudinary! It is necessary!!");
    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        username: username.toLowerCase(),
        email,
        password,
    })

    const Createduser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!Createduser) {
        throw new ApiError(500, "Something went wrong in creating user");
    }

    return res.status(201).json(
        new ApiResponse(201, "User created successfully", Createduser)
    )



})

const loginUser = asyncHandler(async (req, res) => {

    const { email, username, password } = req.body;

    if (!(username || email)) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findOne({
        $or: [{ email }, { username }]
    })

    if (!user) {
        throw new ApiError(400, "User not found");
    }

    const validPassword = await user.matchPassword(password)

    if (!validPassword) {
        throw new ApiError(400, "Invalid credentials");
    }


    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    const { accessToken, refreshToken } = await generateAccessAndRefressToken(user._id)

    console.log("Access Token here: ", accessToken);
    console.log("Refresh Token here: ", refreshToken);

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, {
                user:
                    loggedInUser,
                accessToken,
                refreshToken
            }, "Login successful",)
        )
})

const logoutUser = asyncHandler(async (req, res) => {

    const options = {
        httpOnly: true,
        secure: true
    }

    await User.findByIdAndUpdate(req.user._id, {
        $set: {
            refreshToken: undefined
        }
    }, {
        new: true
    }
    )


    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(200, {}, "Logout successful")
        )
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    //We have 2 kinds of tokens in our system-Access Token which is shortlived 
    //and Refresh Token which is longlived. Since access token will expire after some time,
    // we need to refresh it so that use can stay logged in for sometime(till refresh token expires).

    //But how do we refresh the access token?
    //The user will hit this api for refreshing its access token.
    //So, req's cookie and req's body will give us the refresh token.
    //We will extract the user using the refresh token.
    //Then we will try to match both the tokens if our work is done then it's ok.
    //otherwise we will throw an error.
    //If it matches then we will generate new access token.

    const refreshtoken = req.cookies.refreshToken || req.body.refreshToken

    if (!refreshtoken) {
        throw new ApiError(401, "Refresh Token not found")
    }

    const decodedRefreshToken = jwt.verify(refreshtoken, process.env.REFRESH_TOKEN_SECRET)

    if(!decodedRefreshToken) { 
        throw new ApiError(401, "Invalid Refresh Token")
    }

    const user = await User.findById(decodedRefreshToken?._id)

    if(!user) {
        throw new ApiError(401, "User not found")
    }   

    const storedRefreshToken = user?.refreshToken

    if(refreshtoken !== storedRefreshToken) {
        throw new ApiError(401, "Invalid Refresh Token")
    }

    const { accessToken, newrefreshtoken } = await generateAccessAndRefressToken(user._id)


    const options ={
        httpOnly: true,
        secure: true
    }
    return res.status(200)
        .cookie("accessToken", accessToken, {
            options
        })
        .cookie("refreshToken", newrefreshtoken, {
            options
        })
        .json(
            new ApiResponse(200, {
                accessToken,
                newrefreshtoken
            }, "Refresh successful")
        )   
})


export {
    registerUser,
    loginUser,
    logoutUser,
refreshAccessToken,

}

//Understand the flow :-
//Controllers are the main function to handle the request and response.
//We call these controllers in the routes file.
//Routes define the routes on which it will server the request. 