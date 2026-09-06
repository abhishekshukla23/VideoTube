
import { timestampAdd, trim } from "firebase/firestore/pipelines";
import mongoose ,{Schema} from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema= new Schema({
     username: {
          type:String,
           unique:true,
          required:true
    },
    fullname:{
        type:String,
        trim:true,
        required:true,
         index:true

    },
    email:{
         type:String,
          unique:true,
        trim:true,
        required:true,
        isLower:true
    },
    avatar:{
        type:String,
        required:true

    },
    coverImage:{
        type:String
    },
    refreshToken:{
        type:String
    },
    password:{
        type:String,
        required:[true,"Password is required"]
    }
   ,watchHistory:[

          {
            type:Schema.Types.ObjectId,
            ref:"Video"
        }
    
   ]
   
},{timestamps:true})


userSchema.pre("save",async function (password) {
      if(!this.isModified("password")) return;
    this.password= await  bcrypt.hash(this.password,10)
})





userSchema.methods.isCorrectPassword= async function (password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken=async function () {
      return jwt.sign({
        _id:this.id,
        username:this.username,
        email:this.email,
        fullname:this.fullname
      },
      process.env.ACCESS_TOKEN_SECRET,
     {
       expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }

    )
    
}

userSchema.methods.generateRefreshToken=async function () {
   return jwt.sign({
        _id:this.id
    },
    process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
)
}











export const User=mongoose.model("User",userSchema);