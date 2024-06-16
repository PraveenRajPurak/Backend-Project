import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {

    const {username} = req.params

    if(!username){
        throw new ApiError("Username is required", 400)
    }

    const info = await User.aggregate([
        {
            $match : {
                username : username
            },
        },
        {
            $lookup : {
                from : "subscriptions",
                localField : "_id",
                foreignField : "channel",
                as : "subscriptions"
            }
        },
        {
            $lookup : {
                from : "videos",
                localField : "_id",
                foreignField : "owner",
                as : "videos"
            }
        },
        {
            $lookup : {
               from : "videos",
               localField : "_id",
               foreignField : "owner",
               as : "videos",
               pipeline : [
                {
                    $lookup : {
                        from : "likes",
                        localField : "_id",
                        foreignField : "video",
                        as : "likes"
                    }
                }
               ]
            }
        }
        
    ])
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel

    const {username} = req.params

    if(!username){
        throw new ApiError("Username is required", 400)
    }

    const videos = await User.aggregate([
        {
            $match : {
                username : username
            },
        },
        {
            $lookup : {
                from : "videos",
                localField : "_id",
                foreignField : "owner",
                as : "videos"
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(200, videos, "Videos successfully fetched"))
})

export {
    getChannelStats, 
    getChannelVideos
    }