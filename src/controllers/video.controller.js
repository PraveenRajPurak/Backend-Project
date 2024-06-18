import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body

    const videoFilePath = req.file?.videoFile[0].path

    const user = req.user._id

    if(!videoFilePath) {
        throw new ApiError("Please upload a video", 400)
    }

    const thumbnailPath = req.file?.thumbnailFile[0].path

    const video = await uploadOnCloudinary(videoFilePath)

    const thumbnail = await uploadOnCloudinary(thumbnailPath)

    if(!video) {
        throw new ApiError("Failed to upload video on Cloudinary", 400)
    }

    if(!thumbnail) {
        throw new ApiError("Failed to upload thumbnail on Cloudinary", 400)
    }

    const newVideo = await Video.create({
        videoFile : video.url,
        thumbnail : thumbnail.url,
        owner : user,
        title,
        description
    })

    if(!newVideo) {
        throw new ApiError("Failed to create video", 400)
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, newVideo, "Video successfully created")
    )
    // TODO: get video, upload to cloudinary, create video
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError("Video not found", 404)
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, video, "Video successfully fetched")
    )

    //TODO: get video by id
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

    const video = await Video.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $project :{
                _id : 0,
                title : 1,
                description : 1,
                thumbnail : 1
            }
        }
    ])

    if (!video) {
        throw new ApiError("Video not found", 404)
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, video, "Video successfully updated")
    )
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    await Video.findByIdAndDelete(videoId);

    return res
    .status(200)
    .json(
        new ApiResponse(200, " ", "Video successfully deleted")
    )
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    const publishStatus = await Video.findByIdAndUpdate(
        videoId,
        {
            $set : {
                isPublished : !isPublished
            }
        },
        {
            new : true
        }
    )

    if(!publishStatus) {
        throw new ApiError("Failed to toggle publish status", 400)
    }
    
    res
    .status(200)
    .json(
        new ApiResponse(200, publishStatus, "Publish status successfully fetched")
    )


})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
