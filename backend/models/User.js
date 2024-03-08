const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const passwordComplexity = require("joi-password-complexity");
// User Schema

const UserSchema= new mongoose.Schema({
  username:{
    type:String,
    required: true,
    trim:true,
    minlength:2,
    maxlength:100,
  },
  email:{
    type:String,
    required: true,
    trim:true,
    minlength:5,
    maxlength:100,
    unique:true,
  },
  password:{
    type:String,
    required: true,
    trim:true,
    minlength:8,
  },
  profilePhoto:{
    type:Object,
    default:{
      url:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
      publicId:null,
    }
  },
  bio: {
    type: String,
  },
  isAdmin:{
    type: Boolean,
    default:false,
  },
  isAccountVerified:{
    type: Boolean,
    default:false,
  },


},{
  timestamps:true, //this will add createdAt and updatedAt as fields in our schema
  toJSON:{virtuals:true},
  toObject:{virtuals:true}
});


// populate post that belong To this user when he get his profile
UserSchema.virtual("posts",{ 
  ref:"Post",
  foreignField:"user",
  localField:"_id"
})


// Genertae Auth Token
UserSchema.methods.generateAuthToken = function(){
  return jwt.sign({id: this._id,isAdmin : this.isAdmin}, process.env.JWT_SECRET);
}

//user model 
const User = mongoose.model("user" , UserSchema);

// validate register user
function validateRegisterUser(obj){
  const schema = Joi.object({
    username : Joi.string().trim().min(2).max(100).required(),
    email : Joi.string().trim().min(5).max(100).required().email(),
    password : passwordComplexity().required(),
  });
  return schema.validate(obj);
}


//validate login user
function validateLoginUser(obj) {
  const schema = Joi.object({
    email : Joi.string().trim().min(5).max(100).required().email(),
    password : Joi.string().trim().min(8).required(),
  });
  return schema.validate(obj);
}

//validate Update user
function validateUpdateUser(obj) {
  const schema = Joi.object({
    username : Joi.string().trim().min(2).max(100),
    password : passwordComplexity(),
    bio: Joi.string(),
  });
  return schema.validate(obj);
}

//validate Email
function validateEmail(obj) {
  const schema = Joi.object({
    email : Joi.string().trim().min(5).max(100).required().email(),
  });
  return schema.validate(obj);
}

//validate New Password
function validateNewPassword(obj) {
  const schema = Joi.object({
    password : passwordComplexity().required(),
  });
  return schema.validate(obj);
}


module.exports={
  User,
  validateRegisterUser,
  validateLoginUser,
  validateUpdateUser,
  validateEmail,
  validateNewPassword
};