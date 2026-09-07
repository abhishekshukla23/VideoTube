import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { AsyncHandler } from "../utils/AsyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import app from "../app.js"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscriptions.model.js"
import { Video } from "../models/video.model.js"
import { ref } from "process" 
import jwt from "jsonwebtoken"
import mongoose from "mongoose"

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId)
    const refreshToken = await user.generateRefreshToken()
    const accessToken = await user.generateAccessToken()
    console.log("Access Token:", accessToken);

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })
    return { accessToken, refreshToken }
  } catch (error) {
    throw new ApiError(500, 'failed to generate access and refresh tokens')
  }
}


const registerUser = AsyncHandler(async (req, res) => {
  const { username, fullname, email, password } = req.body

  if ([username, fullname, email, password].some((field) => (
    field?.trim() === ""
  )))
    throw new ApiError(400, "all fields are required")

  const userExists = await User.findOne({
    $or: [{ email }, { username }]
  })
  if (userExists) {
    throw new ApiError(409, "User already exists")
  }
  console.log(req.files)

  const avatarLocalPath = req.files?.avatar[0]?.path
  if (!avatarLocalPath)
    throw new ApiError(409, "avatar is required")
  const avatar = await uploadOnCloudinary(avatarLocalPath)
  let coverImageLocalPath;
  if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)
  console.log(avatar)
  const user = await User.create({
    username: username.toLowerCase(),
    password: password,
    email: email,
    fullname: fullname,
    avatar: avatar?.url,
    coverImage: coverImage?.url || ""

  })
  const createdUser = await User.findById(user._id).select("-password -refreshToken")
  if (!createdUser) throw new ApiError(500, "failed to register user")

  res.status(201).json(
    new ApiResponse(201, createdUser, "user registered Successfully")
  )

})

const userLogin = AsyncHandler(async (req, res) => {
  const { email, username, password } = req.body;


  if (!(email || username)) {
    throw new ApiError(400, "Email or username is required");
  }


  const user = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }


  const isPasswordCorrect = await user.isCorrectPassword(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid user credentials");
  }


  const { accessToken, refreshToken } =
    await generateAccessAndRefreshTokens(user._id);

  const loggedInUser = await User.findById(user._id)
    .select("-password -refreshToken");


  const options = {
    httpOnly: true,
    secure: true
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken
        },
        "User logged in successfully"
      )
    );
});
const userLogout = AsyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined
      }
    },
    {
      new: true
    }
  )
  const options = {
    httpOnly: true,
    secure: true
  }
  return res.status(200).
    clearCookie("refreshToken", options).
    clearCookie("accessToken", options).
    json(
      new ApiResponse(
        200,
        {

        },
        "user logged out successfully"
      )
    )
})

const refreshAccessToken = AsyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
  if (!incomingRefreshToken) throw new ApiError(402, "unauthorized access")
  try {
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    if (!decodedToken) throw new ApiError(400, "invalid refresh token")

    const user = await User.findById(decodedToken?._id)
    if (user.refreshToken !== incomingRefreshToken) throw new ApiError(401, "invalid refresh token")

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    const options = {
      httpOnly: true,
      secure: true
    }

    return res.status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken: accessToken,
            refreshToken: refreshToken

          },
          "access token refreshed successfully"
        )
      )



  } catch (error) {
    throw new ApiError
    401,
      error?.message || "failed to refresh accessToken"
  }
})
const changePassword = AsyncHandler(async (req, res) => {

  const { oldpassword, newpassword } = req.body
  const user = await User.findById(req.user?._id)

  if (!user) throw new ApiError(404, "user not found")
  const checkPass = await user.isCorrectPassword(oldpassword)
  if (!checkPass) throw new ApiError(400, "invalid old password")
  user.password = newpassword
  await user.save({ validateBeforeSave: false })
  return res.status(200).
    json(
      new ApiResponse(
        200,
        user,
        "password changed successfully"
      )
    )
})

const getCurrentUser = AsyncHandler(async (req, res) => {
  return res.status(200).
    json(
      new ApiResponse(
        200,
        req.user,
        "user fetched successfully"
      )
    )
})








const updateAccountDetails = AsyncHandler(async (req, res) => {
  const { email, fullname } = req.body;
  if (!(email || fullname)) throw new ApiError(401, "both email and fullname is required")
  const user =
    await User.findByIdAndUpdate(
      req.user?._id, {
      $set: {
        fullname: fullname,
        eamil: email
      }
    }, {
      new: true
    }
    ).select("-password")

  return res.status(200).
    json(
      new ApiResponse(
        200,
        user,
        "account details updated successfully"
      )
    )




})


const updateAvatar=AsyncHandler(async (req,res)=>{
  const avatarLocalPath=req.file?.path
  if(!avatarLocalPath) throw new ApiError(
    402,"couldnt get avatar path"
  )
  const avatar=await uploadOnCloudinary(avatarLocalPath)
  const user=await User.findByIdAndUpdate(
    req.user_id,{
      $set:{
        avatar:avatar.url
      }
    },{
      new:true
    }
  ).select("-password")

  return res.status(200)
  .json(
    new ApiResponse(
      200,
     user,
    "avatar updated successfully"
    )
  )
})

const updateCoverImage=AsyncHandler(async (req,res)=>{
    const coverImageLocalPath=req.file?.path
    if(!coverImageLocalPath) throw new ApiError(404,"coverImage not given")
    const coverImage=await uploadOnCloudinary(coverImageLocalPath)
  const user=await User.findByIdAndUpdate(
    req.user._id,
    {
      $set:{
        coverImage:coverImage.url
      }
    },
    {
      new:true
    }
  ).select("-password")

  return res.status(200).
  json(
    new ApiResponse(
      200,
      user,
      "cover image changed successfully"
    )
  )


})

const getUserChannelProfile=AsyncHandler(async (req,res)=>{
  const {username}=req?.params;
  if(!username?.trim()){
    throw new ApiError(400,"username is missing")
  }
  const channel=await User.aggregate(
    [
      {
        $match:{
          username:username?.toLowerCase()
        }

      },
      {
        $lookup:{
            from:"subscriptions",
            localField:"_id",
            foreignField:"channel",
            as:"subscribers"
        }
      },
      {
        $lookup:{
          from:"subscriptions",
          localField:"_id",
          foreignField:"subscriber",
          as:"subscribedTo"

        }
      },
      {
        $addFields:{
           subsribersCount:{
            $size:"$subscribers"
           },
           subscribedToCount:{
            $size:"$subscribedTo"
           },
           isSubscribed:{
             $cond:{
               if:{$in:[req.user._id,"$subscribers.subscriber"]},
               then:true,
               else:false
             }
           }
        }
      }
      ,{
        $project:{
          fullname:1,
          username:1,
          email:1,
          subscribersCount:1,
          isSubscribed:1,
          subscribedToCount:1,
          avatar:1,
          coverImage:1

        }
      }
    ]
  )

  if(!channel.length)
    throw new ApiError(404,"channel does not exist")


   return res.status(200)
   .json(
    new ApiResponse(
      200,
      channel[0],
      "user fetched successfully"

    )
   )

})

const getUserWatchHistory=AsyncHandler(async(req,res)=>{
  const user=await User.aggregate(
    [
      {
        $match:{
          _id:new mongoose.Types.ObjectId(req.user._id)
        }

      },
      {
        $lookup:{
          from:"videos",
          localField:"watchHistory",
          foreignField:"_id",
          as:"watchHistory",
          pipeline:[
            {
              $lookup:{
                from:"users",
                localField:"owner",
                foreignField:"_id",
                as:"owner",
                pipeline:[
                  {
                    $project:{
                      fullname:1,
                      username:1,
                      avatar:1
                    }

                  }
                ]
              }

             
            },{
              $addFields:{
                owner:{
                 $first:"$owner"
                }
              }
            }
          ]
        }

      }
    ]
  )


  if(user.length===0) {
    throw new ApiError(404,"user not found")
  }
  return res.status(200).
json(
  new ApiResponse(
    200,
    user[0].watchHistory,
    "watch history fetched"
  )
)





})







export { registerUser, 
  userLogin,
   userLogout,
   refreshAccessToken, 
   changePassword, 
   getCurrentUser, 
   updateAccountDetails,
   updateAvatar,
   updateCoverImage,
   getUserChannelProfile,
   getUserWatchHistory
  }