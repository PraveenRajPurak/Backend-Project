import { Router } from 'express';
import {
    createTweet,
    deleteTweet,
    getUserTweets,
    updateTweet,
} from "../controllers/tweet.controller.js"
import {verifyToken} from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyToken); // Apply verifyJWT middleware to all routes in this file

router.route("/create-tweet").post(verifyToken,createTweet);
router.route("/user-tweets/:userId").get(verifyToken, getUserTweets);
router.route("/update-tweet/:tweetId").patch(verifyToken, updateTweet);
router.route("/delete-tweet/:tweetId").delete(verifyToken, deleteTweet);

export default router