import { Router } from "express";
import { registerUser, loginUser, logoutUser, refreshAccessToken } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import {verifyToken} from "../middlewares/auth.middleware.js";


const router = Router();

router.route("/register").post(
    upload.fields(
        [
            {
                name : "avatar",
                maxLength : 1,
            },
            {
                name : "coverImage",
                maxLength : 1
            }
        ]
    ),
    registerUser);


router.route("/login").post(loginUser);

router.route("/logout").post(
    verifyToken,
    logoutUser);

router.route("/refreshAccessToken").post(refreshAccessToken);


export default router;


//Understand the flow :- 
//You will see we are not using direct routes but using express router.
// It will help us to define the routes. 
// In the app.js file, we will call this router.
// For nearly all the routes, we will follow the same flow. 
// While in some case, middleware will be used before or after the controller.