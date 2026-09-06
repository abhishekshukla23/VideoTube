import { AsyncHandler } from "../utils/AsyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import {Likes} from "../models/likes.model.js"
import mongoose,{isValidObjectId} from "mongoose"












const toggleVideoLike = AsyncHandler(async (req, res) => {
    const {videoId} = req.params
    const  userId=req.user._id;
    const checkLiked= await Likes.findOne(
        {
            likedBy:userId,
            video:videoId
        }
    )
    if(checkLiked)  {
        await Likes.findByIdAndDelete(checkLiked._id)
    
    return res.
    status(200)
    .json(
        new ApiResponse(
            200,
            null,
            "unliked the video"

        )
    )
    }
 const liked=await Likes.create(
    {
        video:videoId,
        likedBy:userId
    },
   
 )

if(!liked) throw new ApiError(500,"failed to like")

return res.
status(200).
json(
    new ApiResponse(
        200,
        liked,
        "liked the video successfully"
    )
)
})

const toggleCommentLike = AsyncHandler(async (req, res) => {
    const {commentId} = req.params
    const  userId=req.user._id;
    const checkLiked= await Likes.findOne(
        {
            likedBy:userId,
            comment:commentId
        }
    )
    if(checkLiked)  {
        await Likes.findByIdAndDelete(checkLiked._id)
    
    return res.
    status(200)
    .json(
        new ApiResponse(
            200,
            null,
            "unliked the comment"

        )
    )
    }
 const liked=await Likes.create(
    {
        comment:commentId,
        likedBy:userId
    },
    
 )

if(!liked) throw new ApiError(500,"failed to like")

return res.
status(200).
json(
    new ApiResponse(
        200,
        liked,
        "liked the comment successfully"
    )
)
    

})

const toggleTweetLike = AsyncHandler(async (req, res) => {
    const {tweetId} = req.params
    const  userId=req.user._id;
    const checkLiked= await Likes.findOne(
        {
            likedBy:userId,
            tweet:tweetId
        }
    )
    if(checkLiked)  {
        await Likes.findByIdAndDelete(checkLiked._id)
    
    return res.
    status(200)
    .json(
        new ApiResponse(
            200,
            null,
            "unliked the tweet"

        )
    )
    }
 const liked=await Likes.create(
    {
        tweet:tweetId,
        likedBy:userId
    },
   
 )

if(!liked) throw new ApiError(500,"failed to like")

return res.
status(200).
json(
    new ApiResponse(
        200,
        liked,
        "liked the tweet successfully"
    )
)
}
)

const getLikedVideos = AsyncHandler(async (req, res) => {
    const userId=req.user._id
   const likedVideos=await Likes.aggregate(
   [
    {
        $match:{
            likedBy:new mongoose.Types.ObjectId(userId)
        }
    },
    {
        $lookup:{
            from:"videos",
            localField:"video",
            foreignField:"_id",
            as:"videoDetails"
        }
    }
   ]
   )
     return res.status(200).json(
        new ApiResponse(
            200,
            likedVideos,
            "liked videos fetched successfully"
        )
    )
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}