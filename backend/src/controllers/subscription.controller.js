import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscriptions.model.js"
import {ApiError} from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { AsyncHandler } from "../utils/AsyncHandler.js"


const toggleSubscription = AsyncHandler(async (req, res) => {
    const {channelId} = req.params
    const subscriberId=req.user._id
    const subscription=await Subscription.findOne({
        subscriber:subscriberId,
        channel:channelId
    })
    if(subscription){
await Subscription.findByIdAndDelete(
            subscription._id
        )
        return res.
        status(200).
        json(
            new ApiResponse(
                200,
                null,
                "unsubscribed"
            )
        )
    }
    const createSubscription=await Subscription.create(
        {
            subscriber:subscriberId,
            channel:channelId
        }
    )
    if(!createSubscription) throw new ApiError(500,"failed to subscribe")
     return res.
     status(200).
     json(
        new ApiResponse(
            200,
            createSubscription,
            "subscribed"

        )
     )
})

const getUserChannelSubscribers = AsyncHandler(async (req, res) => {

    const { channelId } = req.params

    const subscriber = await Subscription.find({
        channel: channelId
    })

    if (subscriber.length === 0) {
        throw new ApiError(404, "subscribers not found")
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            subscriber,
            "fetched subscribers successfully"
        )
    )
})
const getSubscribedChannels = AsyncHandler(async (req, res) => {

    const { subscriberId } = req.params

    const channels = await Subscription.find({
        subscriber: subscriberId
    })

    // if (channels.length === 0) {
    //     throw new ApiError(404, "channels not found")
    // }

    return res.status(200).json(
        new ApiResponse(
            200,
            channels,
            "fetched all channels successfully"
        )
    )
})
export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}