import { AsyncHandler } from "../utils/AsyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import {Comment} from "../models/comments.model.js"
import mongoose,{isValidObjectId} from "mongoose"


const getVideoComments = AsyncHandler(async (req, res) => {
   
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    const pageNo=Number(page)
    const limitNo=Number(limit)
    const skip=(pageNo-1)*limitNo;

    const comments=await Comment.aggregate(
        [
            {
                $match:{
                    video:new mongoose.Types.ObjectId(videoId)

                }
            },
            {
                
    $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails"
    }

            },
            {
                $skip:skip
            },
            {
                $limit:limitNo
            }
        ]
    )
     return res.status(200).json(
        new ApiResponse(
            200,
            comments,
            "comments fetched successfully"
        )
    )

})

const addComment = AsyncHandler(async (req, res) => {
    const userId=req.user._id;
    const {videoId}=req.params;
    const {content}=req.body;
    const comment=await Comment.create(
        {
           video:videoId,
           owner:userId,
           content
        }
    )

    if(!comment) throw new ApiError(500,"failed to add comment")
 const newComment = await Comment.aggregate([
    {
        $match: {
            _id: comment._id
        }
    },
    {
        $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "ownerDetails"
        }
    }
])


 return res.
 status(200)
 .json(
    new ApiResponse(
        200,
        newComment[0],
        "commented successfully"
    )
 )
})

const updateComment = AsyncHandler(async (req, res) => {
     const {content}=req.body;
     const {commentId}=req.params;
    const comment=await Comment.findById(commentId)
    if(!comment){
        throw new ApiError(404,"comment not found")
    }
    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "you cannot update this comment");
    }

    comment.content = content;
    await comment.save();
   return res.
   status(200)
   .json(
    new ApiResponse(
        200,
        comment,
        "updated comment successfully"
    )
   )
})

const deleteComment = AsyncHandler(async (req, res) => {
   const {commentId}=req.params;
   const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "comment not found");
    }

    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "you cannot delete this comment");
    }

    await Comment.findByIdAndDelete(commentId);

   return res.
   status(200).
   json(
    new ApiResponse(
        200,
    comment,
    "deleted the comment successfully"
    )
   )
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }