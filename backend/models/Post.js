const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");


// Post Schema
const PostSchema= new mongoose.Schema({
  title:{
     type: String,
     required: true,
     trim: true,
     minlength:2,
     maxlength : 200,
    
    }, 
    description:{
      type: String,
      required: true,
      trim: true,
      minlength:10,
     },  
     user:{
      type: mongoose.Schema.Types.ObjectId,
      ref:"user",
      required: true,
      }, 
    category:{
      type:String ,
      required:true,
    },
    location: {
      type: String, // Assuming location is sent as a stringified object
      required: true,
    },
    images: [
      {
        url: { type: String, required: true }, // Cloudinary image URL
        public_id: { type: String, required: true }, // Cloudinary public ID
      }
    ],
    likes:[
      {
        type : mongoose.Schema.Types.ObjectId,
        ref:"user"
      }
    ]
},{
  timestamps:true, //this will add createdAt and updatedAt as fields in our schema
  toJSON:{virtuals:true},
  toObject:{virtuals:true}
});

//populate comments for this post
PostSchema.virtual("comments",{
  ref:"Comment",
  foreignField:"postId",
  localField:"_id"
})


//Post model
const Post = mongoose.model("Post", PostSchema);

// Validate Create Post
function validateCreatePost(obj){
  const schema= Joi.object({
    title:Joi.string().trim().min(2).max(200).required(),
    description:Joi.string().trim().min(10).required(),
    category:Joi.string().trim().required(),
    location: Joi.string().required(), // Assuming location is a stringified object
    
  })
  return schema.validate(obj);
}

// Validate Update Post
function validateUpdatePost(obj){
  const schema= Joi.object({
    title:Joi.string().trim().min(2).max(200),
    description:Joi.string().trim().min(10),
    category:Joi.string().trim(),
    location: Joi.string(), // Assuming location is a stringified object
  })
  return schema.validate(obj);
}


module.exports = {
  Post,
  validateCreatePost,
  validateUpdatePost,
}