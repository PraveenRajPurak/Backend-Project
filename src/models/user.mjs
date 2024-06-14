import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    avatar: {
        type: String,
        required: true,
    },
    coverImage: {
        type: String,
    },
    password: {
        type: String,
        required: [true, "Password is required !!!"],
    },
    watchHistory: [
        {
            type: Schema.Types.ObjectId,  // We are storing the id of the video in the watch history. 
            ref: "Video",
        }
    ],
    refreshToken: {
        type: String,
    }
}, { timestamps: true })

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
}) // We had to store password in plain text. So we are hashing it and then saving it to ensure security.

userSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
} // User does not know that the password is hashed. So we are comparing plain text password with hashed password.

//JWT TOKENS

userSchema.methods.GenerateAccessToken = function () {

    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email,
            fullname: this.fullname,
        }, process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    )
} //We generate the access token for the user. We will use it for authentication.

userSchema.methods.GenerateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        }, process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    )
} //We generate the refresh token for the user. We will use it for authentication.

export const User = mongoose.model("User", userSchema)