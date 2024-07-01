import mongoose from "mongoose"
import { Video } from "../models/video.mjs"
import { Subscription } from "../models/subscription.mjs"
import { Like } from "../models/like.mjs"
import { User } from "../models/user.mjs"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {

    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

    const { username } = req.params

    if (!username) {
        throw new ApiError("Username is required", 400)
    }


    const info = await User.aggregate([
        {
            $match: {
                username: username
            },
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscriptions"
            }
        },
        {
            $addFields: {
                subscriptionsCount: {
                    $size: "$subscriptions"
                }
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "_id",
                foreignField: "owner",
                as: "videos"
            }
        },
        {
            $addFields: {
                videosCount: {
                    $size: "$videos"
                },
                totalViews: {
                    $sum: "$videos.views"
                }
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "videos._id",
                foreignField: "video",
                as: "videoLikes"
            }
        },
        {
            $addFields: {
                "likesCount": { $size: "$videoLikes" }
            }
        },
        {
            $project : {
                _id : 1,
                fullname: 1,
                totalViews : 1,
                subscriptionsCount : 1,
                videosCount : 1,
                likesCount : 1,
                coverImage : 1,
                avatar : 1,
                username : 1,
            }
        }
    ])

    console.log("Info : ", info[0]);

    if(!info) {
        throw new ApiError("Channel not found", 404)
    }


    res
        .status(200)
        .json(
            new ApiResponse(200, info[0], "Channel stats successfully fetched"))

})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel

    const { username } = req.params

    if (!username) {
        throw new ApiError("Username is required", 400)
    }

    const videos = await User.aggregate([
        {
            $match: {
                username: username
            },
        },
        {
            $lookup: {
                from: "videos",
                localField: "_id",
                foreignField: "owner",
                as: "videos"
            }
        },
        {
            $project: {
                _id: 0,
                videos: 1
            }
        }

    ])


    if(!videos) {
        throw new ApiError("Something went wrong", 400)
    }



    return res
        .status(200)
        .json(
            new ApiResponse(200, videos[0], "Videos successfully fetched"))
})

export {
    getChannelStats,
    getChannelVideos
}