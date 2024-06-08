import {v2 as cloudinary} from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
}) //Here we are configuring cloudinary.


// Now we will follow a flow :
// 0. Allow user to uplaod the file using multer middleware. Move the file to local storage. 
// 1. Get the filepath of the file from node fs module.
// 2. Upload the file to cloudinary.
// 3. Return the url of the uploaded file.
// Here we will do step 1,2 and 3.

const uploadOnCloudinary = async (filePath) => {
    try{
        if(!filePath) return null

        const response = await cloudinary.uploader.upload(filePath, {
            resource_type: "auto", //Automatically detect file type
        })
        console.log("File is now uploaded to cloudinary.",response)

        //Here we will unlink the file to avoid memory leaks. Since the file is now uploaded to cloudinary we will not need it any more.
        fs.unlinkSync(localFilePath)
        return response;
    }
    catch(error){
        //Here we will unlink the filepath to avoid memory leaks.
        fs.unlinkSync(filePath);
        console.log(error);
        return null
    }
}

export {uploadOnCloudinary}