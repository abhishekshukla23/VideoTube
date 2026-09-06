import {v2 as cloudinary} from "cloudinary"
import fs, { unlinkSync } from "fs"




cloudinary.config({
    api_key:process.env.CLOUDINARY_API_KEY ,
    api_secret:process.env.CLOUDINARY_API_SECRET,
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME
})


const uploadOnCloudinary=async (localFilePath)=>{
       cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });

    try{
        if(!localFilePath) return null;
   const response=  await cloudinary.uploader.upload(localFilePath,{
        resource_type:"auto"
    })
  return response;
    }
   catch(err){
    console.error("Cloudinary Error:", err);

    if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
    }

    return null;
}
}
export {uploadOnCloudinary}