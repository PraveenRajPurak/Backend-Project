import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.mjs"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    //TODO: create playlist

    const playlistCreation = await Playlist.create({
        name : name,
        description : description,
        owner : req.user._id
    })

    if(!playlistCreation) {
        new ApiError("Something went wrong in Playlist Creation", 500)
    }

    return res.status(200).json(
        new ApiResponse(200, playlistCreation, "Playlist created successfully")
    )
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists

    const userPlaylists = await Playlist.find({
        owner : userId
    })

    if(!userPlaylists) {
        throw new ApiError("No playlists found", 404)
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, userPlaylists, "Playlists successfully fetched")
    )

})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id

    const playlist = await Playlist.findById(playlistId)

    if(!playlist) {
        throw new ApiError("Playlist not found", 404)
    }

    return 
    res.status(200)
    .json(
        new ApiResponse(200, playlist, "Playlist successfully fetched")
    )

})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    if(!isValidObjectId(videoId)) {
        throw new ApiError("Invalid video Id", 400)
    }
    // TODO: add video to playlist

    const playlist = await Playlist.findById(playlistId)

    if(!playlist) {
        throw new ApiError("Playlist not found", 404)
    }

    const checkVideoExist = playlist.videos.includes(videoId)
    
    if(checkVideoExist) {
        throw new ApiError("Video already exist in playlist", 400)
    }

    playlist.videos.push(videoId)
    await playlist.save()

    return res
    .status(200)
    .json(
        new ApiResponse(200, playlist, "Video successfully added to playlist")
    )
    
   

})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist

    if(!isValidObjectId(videoId)) {
        throw new ApiError("Invalid video Id", 400)
    }

    const playlist = await Playlist.findById(playlistId)

    if(!playlist) {
        throw new ApiError("Playlist not found", 404)
    }

    const checkVideoExist = playlist.videos.includes(videoId)
    
    if(!checkVideoExist) {
        throw new ApiError("Video does not exist in playlist", 400)
    }

    playlist.videos = playlist.videos.filter(video => video !== videoId)
    await playlist.save()

    return res
    .status(200)
    .json(
        new ApiResponse(200, playlist, "Video successfully removed from playlist")
    )

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist

    const playlist = await Playlist.findByIdAndDelete(playlistId)

    if(!playlist) {
        throw new ApiError("Playlist not found", 404)
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, playlist, "Playlist successfully deleted")
    )

})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist

    const playlistUpdate = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set : {
                name : name,
                description : description
            }
        },{
            new : true
        }
    )

    if(!playlistUpdate) {
        throw new ApiError("Playlist could not be updated !!! ", 400)
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, playlistUpdate, "Playlist successfully updated")
    )
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
