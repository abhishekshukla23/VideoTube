import mongoose, { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweets.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { AsyncHandler } from "../utils/AsyncHandler.js"

const createTweet = AsyncHandler(async (req, res) => {
    const {userId}=req.params;
    const {content}=req.body;
    const tweet=await Tweet.create(
        {
            owner:userId,
            content:content
        }
    )
    if(!tweet) throw new ApiError(500,"failed to create a tweet")


    return res.
    status(200).
    json(new ApiResponse(
        200,
        tweet,
        "tweet created successfully"
    ))
})

const getUserTweets = AsyncHandler(async (req, res) => {
    const {userId}=req.params;
    const tweet=await Tweet.find(
        {
            owner:userId
        }
    )
    if(!tweet) throw new ApiError(404,"tweet not found")

        return res.
        status(200).
        json(
            new ApiResponse(
                200,
                tweet,
                "tweet fetched successfully"
            )
        )
})

const updateTweet = AsyncHandler(async (req, res) => {
   const {tweetId}=req.params;
   const {content}=req.body;
   const tweet=await Tweet.findByIdAndUpdate(
    tweetId,{
        $set:{
            content
        }
    },
    {
        new:true
    }
   )
if (!tweet) {
    throw new ApiError(404, "tweet not found");
}
   return res.
   status(200)
   .json(
    new ApiResponse(
        200,
        tweet,
        "tweet updated successfully"
    )
   )
})

const deleteTweet = AsyncHandler(async (req, res) => {
   const {tweetId}=req.params;
   const tweet=await Tweet.findByIdAndDelete(tweetId)
   if(!tweet) throw new ApiError(404,"tweet not found")

 return res.
 status(200).
 json(
    new ApiResponse(
        200,
        tweet,
        "tweet deleted successfully"
    )
 )
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}