const asyncHandler = require("express-async-handler");
const { User, validateUpdateUser } = require("../models/User");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs= require("fs");
const {cloudinaryUploadImage,cloudinaryRemoveImage,cloudinaryRemoveMulitipleImage} = require("../utils/cloudinary")
const { Comment } = require("../models/Comment");
const { Post } = require("../models/Post");


/**
 * @desc get all user profile
 * @route /api/users/profile
 * @method GET
 * @access private (only admin)
 */
module.exports.getAllUsersCtrl = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").populate("posts");;
  res.status(200).json(users);
});


/**
 * @desc get user profile
 * @route /api/users/profile/:id
 * @method GET
 * @access public
 */
module.exports.getUserProfileCtrl = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password").populate("posts");
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }

  res.status(200).json(user);
});




/**
 * @desc Update user profile
 * @route /api/users/profile/:id
 * @method PUT
 * @access private(only user himself)
 */


module.exports.updateUserProfileCtrl = asyncHandler(async(req,res)=>{
    const {error} = validateUpdateUser(req.body);
    if(error){
      return res.status(400).json({message:error.details[0].message});
    }

    if(req.body.password){
      const salt = await bcrypt.genSalt(10);
      req.body.password=await bcrypt.hash(req.body.password,salt);
    }

    const updatedUser= await User.findByIdAndUpdate(req.params.id,{
      $set:{
        username: req.body.username,
        password: req.body.password,
        bio: req.body.bio
      }
    },{new : true}).select("-password");

    res.status(200).json(updatedUser);
});


/**
 * @desc get users count
 * @route /api/users/count
 * @method GET
 * @access private (only admin)
 */
module.exports.getUsersCountCtrl = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json(users.length);
});



/**
 * @desc Profile photo upload
 * @route /api/users/profile/profile-photo-upload
 * @method POST
 * @access private (only logged in user)
 */

module.exports.profilePhotoUploadCtrl = asyncHandler(async(req,res)=>{
  // 1.validation
  if(!req.file){
    return res.status(400).json({message:"no file provided!"})
  }

  //2. Get the path to the image 
  const imagePath = path.join(__dirname,`../images/${req.file.filename}`);
  //3. Upload to cloudinary
  const result = await cloudinaryUploadImage(imagePath);
  //4. Get the user from DB
  const user = await User.findById(req.user.id)
  //5. Delete the old profile photo if exist 
  if(user.profilePhoto.publicID!== null){
    await cloudinaryRemoveImage(user.profilePhoto.publicID)
  }
  //6. change the profilePhoto field in the DB
  user.profilePhoto={
    url : result.secure_url,
    publicID:result.public_id
  }
  await user.save();
  //7 send response to client 
  res.status(200).json({
    message:"your profile photo uploaded successfully" ,
    profilePhoto:{url:result.secure_url, publicID:result.public_id}
  })

  //8. remove image from the server 
  fs.unlinkSync(imagePath);
});


/**
 * @desc Delete user profile(Account)
 * @route /api/users/profile/:id
 * @method DELETE
 * @access private(only Admin or User himself)
 */

module.exports.deleteUserProfileCtrl = asyncHandler(async(req,res)=>{
    //1. get the user from the DB
    const user = await User.findById(req.params.id);
    if(!user){
      return res.status(404).json({message:"user not found"})
    }

    //2. Get all posts from DB
    const posts = await Post.find({user : user._id})

    //3. Get the public ids from the posts
    const publicIds = posts?.map((post)=> post.image.public_id);

    //4. delete all posts images from cloundinary if exisit 
    if(publicIds?.length > 0){
      await cloudinaryRemoveMulitipleImage(publicIds)
    }
    //5. delete the profile picture from the cloudinary
    await cloudinaryRemoveImage(user.profilePhoto.publicID);

    //6. delete user posts and comments
    await Post.deleteMany({user: user._id}).catch(err=>console.log(err));
    await Comment.deleteMany({user: user._id}).catch(err=>console.log(err));

    //7. delete the user 
    await User.findByIdAndDelete(req.params.id);
    //8. send the response to the client
    res.status(200).json({message:"your profile has been deleted"})

});