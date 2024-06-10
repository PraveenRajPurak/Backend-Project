import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "..models/user.mjs";
import {uploadOnCloudinary} from "../utils/cloudinary.js"

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
        $or: [email, username]})

    if (userExist) {
        throw new ApiError(400, "User already exists");
    }

    const avatarlocalpath = req.files?.avatar[0]?.path
    const coverimagelocalpath = req.files?.coverImage[0]?.path

    if(!avatarlocalpath ){
        throw new ApiError(400, "Please upload your avatar! It is necessary!!");
    }

    const avatar = await uploadOnCloudinary(avatarlocalpath)
    const coverImage = await uploadOnCloudinary(coverimagelocalpath)

    if(!avatar){
        throw new ApiError(400, "Avatar not uploaded on cloudinary! It is necessary!!");
    }

    const user = User.create({
        fullname,
        avatar : avatar.url,
        coverImage : coverImage.url || "",
        username : username.toLowerCase(),
        email,
        password,
    })

    const createUser = await user.findbyId(user._id).select(
        "-password -refreshToken"
    )

    if(!createUser){
        throw new ApiError(500, "Something went wrong in creating user");
    }

    return res.status(201).json(
        new ApiResponse(201, "User created successfully", createUser)
    )



})



export {
    registerUser,
}

//Understand the flow :-
//Controllers are the main function to handle the request and response.
//We call these controllers in the routes file.
//Routes define the routes on which it will server the request. 