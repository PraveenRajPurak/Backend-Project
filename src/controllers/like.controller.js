import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.mjs"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params

    const IdCheck = isValidObjectId(videoId)

    if(!IdCheck) {
        throw new ApiError("Invalid video id", 400)
    }

    const likedVideoCheck = await Like.findOne({
        video : videoId,
        likedBy: req.user?._id
    })

    if(likedVideoCheck) {
        await Like.findByIdAndDelete(likedVideoCheck._id)
        return res
        .status(200)
        .json(
            new ApiResponse(200,"", "Like on Video successfully deleted")
        )
    }
    
    else {
        const likeCreation = await Like.create({
            video : videoId,
            likedBy: req.user?._id
        })
    
        if(!likeCreation) {
            throw new ApiError("Something went wrong in Toggling Like on Video", 500)
        }
    
        return res
        .status(200)
        .json(
            new ApiResponse(200,"", "Like on Video successfully created")
        )
    }
    
    //TODO: toggle like on video
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params

    const IdCheck = isValidObjectId(commentId)

    if(!IdCheck) {
        throw new ApiError("Invalid comment id", 400)
    }

    const likedCommentCheck = await Like.findOne({
        comment : commentId,
        likedBy: req.user?._id
    })

    if(likedCommentCheck) {
        await Like.findByIdAndDelete(likedCommentCheck._id)
        return res
        .status(200)
        .json(
            new ApiResponse(200,"", "Like on Comment successfully deleted")
        )
    }
    
    else {
        const likeCreation = await Like.create({
            comment : commentId,
            likedBy: req.user?._id
        })
    
        if(!likeCreation) {
            throw new ApiError("Something went wrong", 500)
        }
    
        return res
        .status(200)
        .json(
            new ApiResponse(200,"", "Like on Comment successfully created")
        )
    }
    //TODO: toggle like on comment

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params

    const likedTweetCheck = await Like.findOne({
        tweet : tweetId,
        likedBy: req.user?._id
    })

    if(likedTweetCheck) {
        await Like.findByIdAndDelete(likedTweetCheck._id)
        return res
        .status(200)
        .json(
            new ApiResponse(200,"", "Like on Tweet successfully deleted")
        )
    }
    
    else {
        const likeCreation = await Like.create({
            tweet : tweetId,
            likedBy: req.user?._id
        })
    
        if(!likeCreation) {
            throw new ApiError("Something went wrong in Toggling Like on Tweet", 500)
        }
    
        return res
        .status(200)
        .json(
            new ApiResponse(200,"", "Like on Tweet successfully created")
        )
    }
    //TODO: toggle like on tweet
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos

    const likeVideos = await Like.aggregate([
        {
            $match : {
                likedBy : req.user?._id
            }
        },
        {
            $lookup : {
                from : "videos",
                localField : "video",
                foreignField : "_id",
                as : "video"
            }
        },
        {
            $project : {
                video : 1,
                likedBy : 1
            }
        }
    ])

    if(!likeVideos) {
        throw new ApiError("Something went wrong", 500)
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,"likeVideos : ", likeVideos)
    )
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}