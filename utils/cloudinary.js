import fs from "fs"
import {v2 as cloudinary} from "cloudinary"
import dotenv from "dotenv"
dotenv.config(".env");

 cloudinary.config({
cloud_name:process.env.CLOUDINARY_CLIENT_NAME,
api_key:process.env.CLOUDINARY_CLIENT_API_KEY,
api_secret:process.env.CLOUDINARY_CLIENT_API_SECRET
})


const uploadOnCloudinary  = async (localFilePath) => {
    try {
        if (!localFilePath) {
            console.log("local file path is missing");
        }

            const response = await cloudinary.uploader.upload(localFilePath,{
                resource_type:"auto"
            })
            fs.unlinkSync(localFilePath)
                return response
    } catch (error) {
        console.log("error in uploading file in cloudinary", error);
        if (fs.existsSync(localFilePath)) {
                
        }
        return null
    }

}

export {uploadOnCloudinary }