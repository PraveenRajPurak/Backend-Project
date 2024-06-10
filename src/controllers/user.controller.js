import {asyncHandler} from "../utils/asyncHandler.js";

const registerUser = asyncHandler (async (req, res, next) => {
    res.status(200).json({
        message: "User registered successfully",
    })
})

export {
    registerUser,
}

//Understand the flow :- 
//Controllers are the main function to handle the request and response.
//We call these controllers in the routes file.
//Routes define the routes on which it will server the request. 