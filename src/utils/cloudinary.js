
import {v2 as cloudinary} from "cloudinary" ;
import fs from "fs" ;

          
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY_CLOUDINARY, 
  api_secret: process.env.API_SECRET_CLOUDINARY
});

const uploadOnCloudinary = async (localFilePath , option) => {
    try {
        if(!localFilePath)return null ;
         
        // upload file
        const response  =await cloudinary.uploader.upload(localFilePath ,option)

        console.log(response) ;

        fs.unlinkSync(localFilePath) 

        return response.url ;

    } catch (error) {
        fs.unlink(localFilePath) // remove the locally saved temp file as upload operation got failed
        return null ;
    }
}


const deleteFileOnCloudinary = async (fileUrl) => {
    try {
        if(!fileUrl)return null ;
        
        const response  =await cloudinary.uploader.destroy(fileUrl ,{
            resource_type : "auto"
        })

        return response ;

    } catch (error) {
        fs.unlink(localFilePath) // remove the locally saved temp file as upload operation got failed
        return null ;
    }
}

export {uploadOnCloudinary , deleteFileOnCloudinary} ;