import mongoose from "mongoose";
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscriptions.model.js"
import {Likes} from "../models/likes.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {AsyncHandler} from "../utils/AsyncHandler.js"
import {User} from "../models/user.model.js"



const getChannelStats = AsyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const {channelId} =req.params;
    
    const stats = await User.aggregate([
  {
    $match: {
      _id: new mongoose.Types.ObjectId(channelId)
    }
  },

  {
    $lookup: {
      from: "subscriptions",
      localField: "_id",
      foreignField: "channel",
      as: "subscribers"
    }
  },

  {
    $lookup: {
      from: "videos",
      localField: "_id",
      foreignField: "owner",
      as: "videos"
    }
  },
{
    $lookup:{
        from:"likes",
        localField:"videos._id",
        foreignField:"video",
        as:"likes"
    }
  },
  {
    $addFields: {
      totalSubscribers: { $size: "$subscribers" },
      totalVideos: { $size: "$videos" },
      totalViews:{$sum:"$videos.views"},
      totalLikes:{$size:"$likes"}

    }
  },
  {
    $project:{
        totalSubscribers:1,
        totalViews:1,
        totalLikes:1,
        totalVideos:1,

    }
  }
  
])

if(!stats) throw new ApiError(404,"no stat found")

return res.
status(200).
json(
    new ApiResponse(
        200,
        stats,
        "fetched the stats of channel successfully"
    )
)


})

const getChannelVideos = AsyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel

    const {channelId}=req.params;

    const allVideos=await User.aggregate(
        [
            {
                $match:{
                    _id:new mongoose.Types.ObjectId(channelId)
                }
            },
            {
                $lookup:{
                    from:"videos",
                    localField:"_id",
                    foreignField:"owner",
                    as:"owner"
                    
                }
            }
        ]
    )


if(!allVideos) throw new ApiError(404,"videos not found")


return res.
status(200).
json(
    new ApiResponse(
        200,
        allVideos,
        "all videos fetched successfully"
    )
)
})












export {
    getChannelStats, 
    getChannelVideos
    }