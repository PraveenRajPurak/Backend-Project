import { Router } from 'express';
import {
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubscription,
} from "../controllers/subscription.controller.js"
import { verifyToken } from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyToken); // Apply verifyJWT middleware to all routes in this file

router
    .route("/subscribed-channels/:subscriberId")
    .get(verifyToken, getSubscribedChannels)

router
    .route("/toggle-subscription/:channelId")
    .post(verifyToken, toggleSubscription);

router
    .route("/user-channel-subscribers/:channelId")
    .get(verifyToken, getUserChannelSubscribers);

export default router