import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { AsyncHandler } from "../utils/AsyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { User } from "../models/user.model.js"
import mongoose,{isValidObjectId, Mongoose} from "mongoose"
import { Video } from "../models/video.model.js"
import { response } from "express"


const getAllVideos=AsyncHandler(async (req,res)=>{
    // console.log("getAllvideos called")
    const {page=1,limit=10,query,sortBy,sortType,userId}=req.query
    const pageNo=Number(page)
    const limitNo=Number(limit)

    const skip=(pageNo-1)*limitNo;
    const sort={};
    if(sortBy){
        sort[sortBy]=sortType==="asc" ?1:-1;
    }
    else{
        sort.createdAt=-1
    }
    // console.log("before aggregation")
    const videos = await Video.aggregate([
   {
    $match: {
        ...(userId && {
            owner: new mongoose.Types.ObjectId(userId)
        }),
        ...(query && {
            title: {
                $regex: query,
                $options: "i"
            }
        })
    }
},
    {
        $sort: {
            createdAt: -1
        }
    },
    {
        $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "owner"
        }
    },
    {
    $unwind: "$owner"
},
 {
        $skip: skip
    },
    {
        $limit: limitNo
    },
    {
    $project: {
        title: 1,
        description: 1,
        thumbnail: 1,
        views: 1,
        createdAt: 1,
        duration: 1,
        ownerId: "$owner._id",
        ownerName: "$owner.username"
    }
}
     
]);


return res.status(200).json(
    new ApiResponse(
        200,
        videos,
        "Videos fetched successfully"
    )
)



})


const publishAVideo=AsyncHandler(async (req,res)=>{
    const {title,description}=req.body
    const videoLocalPath=req.files?.videoFile[0]?.path;
    const thumbnailLocalPath=req.files?.thumbnail?.[0].path;
    if(!videoLocalPath||!thumbnailLocalPath) throw new ApiError(401,"thumbnail and video not provided")
     const videofile=await uploadOnCloudinary(videoLocalPath)
    const thumbnail=await uploadOnCloudinary(thumbnailLocalPath)
    console.log(req.user._id)
    const video=await Video.create(
        {
            title,
            description,
            videoFile:videofile.url,
            thumbnail:thumbnail.url,
            duration:videofile.duration,
            owner:req.user._id
        }
    )
    if(!video) throw new ApiError(500,"Failed to publish video")
        return res.
    status(200).
    json(
        new ApiResponse(
            200,
            video,
            "video published successfully"
        )
    )

})


const getVideoById = AsyncHandler(async (req, res) => {
    const { videoId } = req.params
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $addToSet:{
                watchHistory:videoId
            }
        }
    )
    const video=await Video.aggregate(
        [
           {
            $match:{
                _id:new mongoose.Types.ObjectId(videoId)
            }
           },
           {
            $lookup:{
                from:"users",
                localField:"owner",
                foreignField:"_id",
                as:"owner"
            }
            
           },
           {
            $unwind:"$owner"
           },
           {
            $lookup:{
                from:"likes",
                localField:"_id",
                foreignField:"video",
                as:"likes"
            }

           },
           {
            $addFields:{
                likesCount:{$size:"$likes"}
            }
           },
           {
            $project:{
                title:1,
                description:1,
                thumbnail:1,
                views:1,
                likesCount:1,
                owner:1,
                createdAt:1,
                duration:1,
                videoFile:1

            }
           }
        ]
    )
    if(video.length===0) throw new ApiError(404,"video not found")

    return res.
    status(200)   
    .json(
        new ApiResponse(
            200,
            video[0],
            "fetched video successfully"

        )
    )
})



const updateVideo = AsyncHandler(async (req, res) => {

    //     console.log("REQ.FILE:", req.file);
    // console.log("REQ.BODY:", req.body);
    const { videoId } = req.params
    const thumbnailLocalPath=req.file?.path;
    // if(!thumbnailLocalPath) throw new ApiError(402,"cant get the thumbnail")
    const thumbnail=await uploadOnCloudinary(thumbnailLocalPath)
    const video=await Video.findByIdAndUpdate(
        videoId,{
            $set:{
                thumbnail:thumbnail?.url,
                title:req.body.title,
                description:req.body.description
            }
        },{
            new:true
        }
    )

    return res.
    status(200)
    .json(
        new ApiResponse(
            200,
            video,
            "details updated successfully"
        )
    )

})

const deleteVideo = AsyncHandler(async (req, res) => {
    const { videoId } = req.params
    

    const video=await Video.findByIdAndDelete(videoId);
      if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "you are not allowed to delete this video");
    }
    if(!video){
        throw new ApiError(404,"video not found")

    }
    return res.
    status(200)
    .json(
        new ApiResponse(
            200,
            video,
            "video deleted successfully"
        )
    )
    
})


const togglePublishStatus = AsyncHandler(async (req, res) => {
    const { videoId } = req.params
    const video=await Video.findById(videoId)
    if(!video) throw new ApiError(404,"video not found")
    
    video.isPublished=!video.isPublished;
    await video.save();

    return res.
    status(200).
    json(
        new ApiResponse(
            200,
            video,
            "video publish status updates successfully"
        )
    )

})

const removeFromWatchHistory=AsyncHandler(async (req,res)=>{
    const {videoId}=req.params;

    const video=await User.findByIdAndUpdate(
        req.user._id,{
                $pull:{
                    watchHistory:videoId
                }
        }
    )

    return res.
    status(200)
    .json(
        new ApiResponse(
            200,
            null,
            "video removed from watchHistory"
        )
    )
})





















export {getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    removeFromWatchHistory
}