import mongoose from "mongoose"
import {Comment} from "../models/comment.mjs"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    const videoComments = await Comment.aggregate({
        $match : {video : videoId}
    })

    const options = {
        page : parseInt(page,10),
        limit : parseInt(limit,10)
    }

    const comments = await Comment.aggregatePaginate(videoComments, options)

    if(!videoComments) {
        throw new ApiError("No comments found", 404)
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, videoComments, "Comments successfully fetched")
    )

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video

    const {videoId} = req.params
    const {comment} = req.body

    const commentCreation = await Comment.create({
        content : comment,
        video : videoId,
        owner: req.user?._id
    })

    if(!commentCreation) {
        throw new ApiError("Something went wrong in Comment Creation", 500)
    }

    return res
    .status(201)
    .json(
        new ApiResponse(201, "Comment created successfully", commentCreation)
    )
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment

    const {commentId} = req.params
    const {comment} = req.body

    const commentUpdate = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set: {
                content: comment
            }
        },
        {
            new: true
        }
    )

    if (!commentUpdate) {
        throw new ApiError("Something went wrong in updating Comment", 500)
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Comment updated successfully", commentUpdate)
    )
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment

    const {commentId} = req.params

    const commentDelete = await Comment.findByIdAndDelete(commentId)

    if(!commentDelete) {
        throw new ApiError("Something went wrong in deleting Comment", 500)
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Comment deleted successfully")
    )
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }
