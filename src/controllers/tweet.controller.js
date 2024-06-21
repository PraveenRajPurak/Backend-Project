import mongoose, { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweet.mjs"
import { User } from "../models/user.mjs"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet

    const { content } = req.body

    const tweetCreation = await Tweet.create({
        content : content,
        owner: req.user._id
    })

    if (!tweetCreation) {
        new ApiError("Something went wrong in Tweet Creation", 500)
    }

    return res
        .status(201)
        .json(
            new ApiResponse(201, "Tweet created successfully", tweetCreation)
        )

})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const { userId } = req.params

    const userTweets = await Tweet.find(
        {
            owner: userId
        }
    )

    if (!userTweets) {
        throw new ApiError("Something went wrong in getting User Tweets", 500)
    }

    res
        .status(200)
        .json(
            new ApiResponse(200, "User Tweets fetched successfully", userTweets)
        )
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet

    const { tweetId } = req.params
    const { content } = req.body

    const tweetUpdate = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set: {
                content: content
            }
        },
        {
            new: true
        }
    )

    if (!tweetUpdate) {
        throw new ApiError("Something went wrong in updating Tweet", 500)
    }

    res
        .status(200)
        .json(
            new ApiResponse(200, "Tweet updated successfully", tweetUpdate)
        )
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet

    const { tweetId } = req.params
    const tweetDelete = await Tweet.findByIdAndDelete(
        tweetId
    )

    if(!tweetDelete) {
        throw new ApiError("Something went wrong in deleting Tweet", 500)
    }

    res
        .status(200)
        .json(
            new ApiResponse(200, "Tweet deleted successfully","")
        )
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
