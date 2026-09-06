import jwt from "jsonwebtoken";
import {ApiError} from "../utils/ApiError.js"
import {AsyncHandler} from "../utils/AsyncHandler.js"
import {User} from "../models/user.model.js"




export const verifyJWT= AsyncHandler(async(req,_,next)=>{
    console.log("req.cookies:", req.cookies);
console.log("accessToken:", req.cookies?.accessToken);
    try{
        const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
        if(!token) throw new ApiError(401,"anauthorized access")
            console.log("Cookies:", req.cookies);
console.log("Authorization:", req.header("Authorization"));

        const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
       const user =await User.findById(decodedToken?._id).select("-password -refreshToken") 
       if(!user) throw new ApiError(401,"Invalid user")
        req.user=user
    next()
    }
    catch(err){
        throw new ApiError(401,err?.message||"Invalid Access Token");
    }
})