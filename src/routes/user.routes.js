import { Router } from "express";
import { registerUser, 
        loginUser, 
        logoutUser, 
        refreshAccessToken,
        changeCurrentPassword,
        getCurrentUser,
        updateAccountDetails,
        updateAvatar,
        updateCoverImage,
        showuserProfile,
        showWatchHistory
    } from "../controllers/user.controller.js";
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

router.route("/logout").post(verifyToken, logoutUser);

router.route("/refresh-Access-Token").post(refreshAccessToken);

router.route("/change-Current-Password").post(verifyToken, changeCurrentPassword);

router.route("/get-CurrentUser").get(verifyToken, getCurrentUser);

router.route("/update-AccountDetails").patch(verifyToken, updateAccountDetails);

router.route("/update--Avatar").patch(verifyToken, upload.single("avatar"), updateAvatar);

router.route("/update-CoverImage").patch(verifyToken, upload.single("coverImage"), updateCoverImage);

router.route("/channel/:username").get(verifyToken, showuserProfile);

router.route("/history").get(verifyToken, showWatchHistory);




export default router;


//Understand the flow :- 
//You will see we are not using direct routes but using express router.
// It will help us to define the routes. 
// In the app.js file, we will call this router.
// For nearly all the routes, we will follow the same flow. 
// While in some case, middleware will be used before or after the controller.