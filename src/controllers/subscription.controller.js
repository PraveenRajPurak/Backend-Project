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

    const ChannelSubscribers = await Subscription.aggregate([
        {
            $match: {
                channel: channelId
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
        }
    ])

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
                subcriber: subscriberId
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
            $addFields: {
                subscribedToCount: {
                    $size: $Channels
                }
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