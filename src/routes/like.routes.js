import { Router } from 'express';
import {
    getLikedVideos,
    toggleCommentLike,
    toggleVideoLike,
    toggleTweetLike,
} from "../controllers/like.controller.js"
import {verifyToken} from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyToken); // Apply verifyJWT middleware to all routes in this file

router.route("/toggle/video-like-toggle/:videoId").post(verifyToken, toggleVideoLike);
router.route("/toggle/c/:commentId").post(toggleCommentLike);
router.route("/toggle/t/:tweetId").post(toggleTweetLike);
router.route("/liked-videos").get(getLikedVideos);

export default router