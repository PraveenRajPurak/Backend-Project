import { Router } from 'express';
import {
    getChannelStats,
    getChannelVideos,
} from "../controllers/dashboard.controller.js"
import {verifyToken} from "../middlewares/auth.middleware.js"

const router = Router();

router.use(verifyToken); // Apply verifyJWT middleware to all routes in this file

router.route("/stats/:username").get(verifyToken, getChannelStats);
router.route("/videos/:username").get(verifyToken, getChannelVideos);

export default router