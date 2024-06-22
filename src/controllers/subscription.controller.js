import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.mjs"
import { Subscription } from "../models/subscription.mjs"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    // TODO: toggle subscription

    const subscribeToggle = await Subscription.find(
        {
            channel: channelId,
            subscriber: req.user._id
        }
    )

    console.log("Subscribe Toggle : ", subscribeToggle);

    if (subscribeToggle.length > 0) {

        await Subscription.findByIdAndDelete(subscribeToggle[0]._id)

        return res
            .status(200)
            .json(
                new ApiResponse(200, "", "Successfully unsubscribed the channel!")
            )
    }

    const subscriptionCreation = await Subscription.create(
        {
            subscriber: req.user._id,
            channel: channelId,
        }
    )

    if (!subscriptionCreation) {
        throw new ApiError("Something Went Wrong in subscriber creation", 400);
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, subscriptionCreation, "Successfully subscribed the channel!")
        )
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params

    if(!isValidObjectId(channelId)) {
        throw new ApiError("Invalid channel id", 400)
    }

    console.log("Channel Id : ", channelId);

    const ChannelSubscribers = await Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "subscriber",
                foreignField: "_id",
                as: "subscriber",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            username: 1,
                            fullname: 1,
                            email: 1
                        }
                    }
                ]
            }
        },
        {
            $unwind : "$subscriber"
        },
        {
            $group : {
                _id : "$channel",
                subscribers : { $push : "$subscriber" }
            } //Proves how big of an asset group operation is. If it would not be there, we'd be getting list of
              // subscription instances with subscriber named field with subscriber information. It would have been a really bad way of handling the task. But group came in the way to save us.
        },
        {
            $project : {
                _id : 0,
                channel : "$_id",
                subscribers : 1
            }
        }
    ])

    console.log("Channel Subscribers : ", ChannelSubscribers);

    if (!ChannelSubscribers) {
        throw new ApiError("Error in fetching subscribers information.", 400);
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, ChannelSubscribers, "Subscribers fetched successfully !")
        )
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    const ChannelsSubscribedTo = await Subscription.aggregate([
        {
            $match: {
                subscriber: new mongoose.Types.ObjectId(subscriberId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "Channels",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            username: 1,
                            fullname: 1,
                            coverImage: 1,
                            avatar: 1,
                        }
                    }
                ]
            }
        },
        {
            $unwind : "$Channels"
        },
        {
            $group : {
                _id : "$subscriber",
                channels : { $push : "$Channels" }
            }
        },
        {
            $project : {
                _id : 0,
                subscriber : "$_id",
                channels : 1
            }
        }
    ])

    if (!ChannelsSubscribedTo) {
        throw new ApiError("Error in fetching subscribers information.", 400);
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, ChannelsSubscribedTo, "Subscribers fetched successfully !")
        )
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}