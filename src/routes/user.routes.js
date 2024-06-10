import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(registerUser);

export default router;


//Understand the flow :- 
//You will see we are not using direct routes but using express router.
// It will help us to define the routes. 
// In the app.js file, we will call this router.
// For nearly all the routes, we will follow the same flow. 
// While in some case, middleware will be used before or after the controller.