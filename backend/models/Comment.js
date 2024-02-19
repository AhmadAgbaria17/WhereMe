const mongooose = require("mongoose");
const Joi = require("joi");


//Comment Schema
const CommentSchema = new mongooose.Schema({
  postId:{
    type:mongooose.Schema.Types.ObjectId,
    ref:"Post",
    required:true,
  },
  user:{
    type:mongooose.Schema.Types.ObjectId,
    ref:"user",
    required:true,
  },
  text:{
    type:String,
    required:true,
  },
  username:{
    type:String,
    required:true,
  },
},{
  timestamps: true, //Saves created at and updated at as dates 
})


//comment Model
const Comment = mongooose.model("Comment",CommentSchema)



//validate create Comment
function validateCreateComment(obj){
  const schema=Joi.object({ 
      postId : Joi.string().required(),
      text: Joi.string().trim().required(),
  });
  return schema.validate(obj);
}


//validate update Comment
function validateUpdateComment(obj){
  const schema=Joi.object({ 
      text: Joi.string().trim().required(),
  });
  return schema.validate(obj);
}



module.exports ={
  Comment,
  validateCreateComment,
  validateUpdateComment,
}