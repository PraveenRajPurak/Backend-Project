import { Router } from 'express';
import {
    deleteVideo,
    getAllVideos,
    getVideoById,
    publishAVideo,
    togglePublishStatus,
    updateVideo,
} from "../controllers/video.controller.js"
import {verifyToken} from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js"

const router = Router();

router.use(verifyToken); // Apply verifyJWT middleware to all routes in this file


router.route("/publishVideo").post(
    verifyToken,
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1,
        },
        {
            name: "thumbnail",
            maxCount: 1,
        },

    ]), publishAVideo);

router
    .route("/getAllVideos")
    .get(verifyToken,getAllVideos)
    ;

router
    .route("/getVideo/:videoId")
    .get(verifyToken,getVideoById)
    ;

router.route("/deleteVideo/:videoId")
    .delete(verifyToken,deleteVideo)
    ;

router
    .route("/updateVideo/:videoId")
    .patch(verifyToken,upload.single("thumbnail"), updateVideo);

router.route("/toggle/publish/:videoId").patch(verifyToken, togglePublishStatus);

export default router;