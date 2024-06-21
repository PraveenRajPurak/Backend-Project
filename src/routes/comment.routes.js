import { Router } from 'express';
import {
    addComment,
    deleteComment,
    getVideoComments,
    updateComment,
} from "../controllers/comment.controller.js"
import {verifyToken} from "../middlewares/auth.middleware.js"

const router = Router();

router.use(verifyToken); // Apply verifyJWT middleware to all routes in this file

router.route("/create-comment/:videoId").post(verifyToken, addComment);
router.route("/get-video-comments/:videoId").get(verifyToken, getVideoComments);
router.route("/comment-update/:commentId").patch(verifyToken, updateComment);
router.route("/comment-delete/:commentId").delete(verifyToken, deleteComment);

export default router