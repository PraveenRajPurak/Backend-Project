import { Router } from 'express';
import {
    addVideoToPlaylist,
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getUserPlaylists,
    removeVideoFromPlaylist,
    updatePlaylist,
} from "../controllers/playlist.controller.js"
import {verifyToken} from "../middlewares/auth.middleware.js"

const router = Router();

router.use(verifyToken); // Apply verifyJWT middleware to all routes in this file

router.route("/create-playlist").post(
    verifyToken,createPlaylist)

router
    .route("/get-playlist/:playlistId")
    .get(
        verifyToken,
        getPlaylistById);

    router
    .route("/update-playlist/:playlistId")
    .patch(
        verifyToken, updatePlaylist);

    router
    .route("/delete-playlist/:playlistId")
    .delete(
        verifyToken, deletePlaylist);


router.route("/add-video-to-playlist/:videoId/:playlistId").patch(
    verifyToken, addVideoToPlaylist);
router.route("/remove-video-from-playlist/:videoId/:playlistId").patch(
    verifyToken, removeVideoFromPlaylist);

router.route("/user-playlists/:userId").get(
    verifyToken, getUserPlaylists);

export default router