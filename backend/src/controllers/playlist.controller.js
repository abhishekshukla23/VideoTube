import {Playlist} from "../models/playlists.model.js"
import {AsyncHandler} from "../utils/AsyncHandler.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {ApiError} from "../utils/ApiError.js"
import mongoose,{isValidObjectId} from "mongoose"


const createPlaylist=AsyncHandler(async (req,res)=>{
    const {name,description} =req.body;
    const playlist=await Playlist.create(
        {
           name,
           description,
           owner:req.user._id
        }
    )

    if(!playlist) throw new ApiError(500,"failed to create playlist")

    return res.
    status(200).
    json(
        new ApiResponse(
                201,
                playlist,
                "playlist created successfully"
        )
    )
})  


const getUserPlaylists = AsyncHandler(async (req, res) => {
    const playlist=await Playlist.find(
        {
            owner:req.user._id
        }
    )
    if(playlist.length===0) throw new ApiError(404,"playlist not found")
    
    return res.
    status(200).
    json(
        new ApiResponse(
            200,
            playlist,
            "playlist fetched successfully"
        )
    )
})


const addVideoToPlaylist = AsyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    const playlist=await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $addToSet:{
                videos:videoId
            }
        },{
            new:true
        }

    )
  if(!playlist) throw new ApiError(404,"playlist not found")

    return res.
    status(200).
    json(
        new ApiResponse(
            200,
            playlist,
            "video added to playlist successfully"
        )
    )
    
})

const getPlaylistById=AsyncHandler(async (req,res)=>{
    const {playlistId}=req.params
    const playlist=await Playlist.findById(playlistId).populate("videos")

    if(!playlist) throw new ApiError(404,"playlist not found")

    return res
    .status(200).
    json(
        new ApiResponse(
            200,
            playlist,
            "playlist fetched successfully"
        )
    )
})

const removeVideoFromPlaylist = AsyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    const playlist=await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $pull:{
                videos:videoId
            }
        },{
            new:true
        }
    )
    return res.
    status(200).
    json(
        new ApiResponse(
            200,
            playlist,
            "video removed from playlist successfully"
        )
    )

})

const deletePlaylist = AsyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const playlist=await Playlist.findByIdAndDelete(
        playlistId
    )
    if(!playlist)  throw new ApiError(404,"video not found");
  return res.
  status(200).
  json(
    new ApiResponse(
        200,
        playlist,
        "playlist deleted successfully"
    )
  )
})

const updatePlaylist = AsyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    const playlist=await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set:{
                name,
                description

            }
        },
        {
            new:true 
              }
    )
    
    return res.
    status(200)
    .json(
        new ApiResponse(
            200,
            playlist,
            "playlist updated successfully"
        )
    )
    
})








export {createPlaylist,
    getUserPlaylists,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist,getPlaylistById
}