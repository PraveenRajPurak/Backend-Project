import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.mjs"
import { User } from "../models/user.mjs"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination

    const sortOptions = { [sortBy]: sortType === 'desc' ? -1 : 1 };

    if (query) {
        match.$or = [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } }
        ]
    }

    if (userId) {
        if (!isValidObjectId(userId)) {
            throw new ApiError("Invalid user id", 400)
        }

        match.owner = userId
    }

    const aggregateQuery = Video.aggregate([
        { $match: match },
        { $sort: sortOptions }
    ]);

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
    };

    const videos = await Video.aggregatePaginate(aggregateQuery, options);

    if (!videos) {
        throw new ApiError("No videos found", 404)
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, videos, "Videos successfully fetched")
        )
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body

    console.log("Title : ", title);
    console.log("Description : ", description);


    const videoFilePath = req.files?.videoFile[0]?.path

    console.log("Video File Path : ", videoFilePath);

    const user = req.user._id

    if (!videoFilePath) {
        throw new ApiError("Please upload a video", 400)
    }

    const thumbnailPath = req.files?.thumbnail[0]?.path

    console.log("Thumbnail Path : ", thumbnailPath);

    if (!thumbnailPath) {
        throw new ApiError("Please upload a thumbnail", 400)
    }

    const video = await uploadOnCloudinary(videoFilePath)

    const thumbnail = await uploadOnCloudinary(thumbnailPath)

    if (!video) {
        throw new ApiError("Failed to upload video on Cloudinary", 400)
    }

    if (!thumbnail) {
        throw new ApiError("Failed to upload thumbnail on Cloudinary", 400)
    }

    const newVideo = await Video.create({
        videoFile: video.url,
        thumbnail: thumbnail.url,
        owner: user,
        title,
        description,
        duration: 0,
    })

    if (!newVideo) {
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
    const { title, description } = req.body

    const thumbnailPath = req.file?.path

    if (!thumbnailPath) {
        throw new ApiError("Please upload a thumbnail", 400)
    }

    const thumbnail = await uploadOnCloudinary(thumbnailPath)

    if (!thumbnail) {
        throw new ApiError("Failed to upload thumbnail on Cloudinary", 400)
    }

    const video = await Video.findByIdAndUpdate(
        new mongoose.Types.ObjectId(videoId),
        {
            $set: {
                title,
                description,
                thumbnail: thumbnail.url
            }
        },
        {
            new: true
        }
    )

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

const increaseWatches = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    const userId = req.user._id

    console.log("User Id : ", userId);

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError("Video not found", 404)
    }

    video.views = video.views + 1
    await video.save({
        validateBeforeSave: false
    })

    const user = await User.findById(userId)

    console.log("User : ", user);

    let status = -1;

    status = user.watchHistory.indexOf(videoId)

    if (status !== -1) {
        return res
            .status(200)
            .json(
                new ApiResponse(200, video.views, "Video already watched")
            )
    }

    user.watchHistory.push(videoId)
    await user.save(
        {
            validateBeforeSave: false
        }
    )

    

    return res
        .status(200)
        .json(
            new ApiResponse(200, video.views, "Video views increased.")
        )
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    const currentStatus = await Video.findById(videoId)

    if (!currentStatus) {
        throw new ApiError("Video not found", 404)
    }

    const publish = currentStatus.isPublished

    const publishStatus = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                isPublished: !publish
            }
        },
        {
            new: true
        }
    )

    if (!publishStatus) {
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
    togglePublishStatus,
    increaseWatches
}
