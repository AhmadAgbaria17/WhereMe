const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
  api_key    : process.env.CLOUDINARY_API_KEY,
  api_secret : process.env.CLOUDINARY_API_SECRET
});

//Clodinart Upload image
const cloudinaryUploadImage = async (fileToUpload)=>{
  try{
    const data = await cloudinary.uploader.upload(fileToUpload,{
      resource_type : 'auto',
    });
    return data
  } catch(error){
    return error
  }
}

//Clodinart Remove image
const cloudinaryRemoveImage = async (imagePublicID)=>{
  try{
    const result = await cloudinary.uploader.destroy(imagePublicID);
    return result
  } catch(error){
    return error
  }
}

//Clodinart Remove Mulitiple image
const cloudinaryRemoveMulitipleImage = async (publicIds)=>{
  try{
    const result = await cloudinary.v2.api.delete_resources(publicIds)
    return result
  } catch(error){
    return error
  }
}

module.exports={
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
  cloudinaryRemoveMulitipleImage,
}