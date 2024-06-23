import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.use(cors({
    origin : process.env.CORS_URL,
    credentials : true
}))

app.use(express.json({ limit: "16Kb"})) // for parsing application/json

app.use(express.urlencoded({extended : true, limit: "16Kb"})) // for parsing application/x-www-form-urlencoded

app.use(express.static("public"))  // for serving static files

app.use(cookieParser()) // for parsing cookies



//routes 

import userRouter from "./routes/user.routes.js";

import videoRouter from "./routes/video.routes.js";

import likesRouter from "./routes/like.routes.js";

import tweetRouter from "./routes/tweet.routes.js";

import commentRouter from "./routes/comment.routes.js";

import playlistRouter from "./routes/playlist.routes.js";

import subscriptionRouter from "./routes/subscription.routes.js";

import dashboardRouter from "./routes/dashboard.routes.js";

app.use("/api/v1/users", userRouter);

app.use("/api/v1/videos", videoRouter);

app.use("/api/v1/likes", likesRouter);

app.use("/api/v1/tweets", tweetRouter);

app.use("/api/v1/comments", commentRouter);

app.use("/api/v1/playlists", playlistRouter);

app.use("/api/v1/subscriptions", subscriptionRouter);

app.use("/api/v1/dashboard", dashboardRouter);

export {app};