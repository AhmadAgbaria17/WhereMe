const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const {User,validateRegisterUser,validateLoginUser} = require("../models/User.js");
const { response } = require("express");


/**
 * @desc register new user
 * @route /api/auth/register
 * @method Post
 * @access public
 */

module.exports.registerUserCtrl = asyncHandler(async (req,res)=>{

  const {error }= validateRegisterUser(req.body)
  if(error){
    return res.status(400).json({message : error.details[0].message})
  }


  let user = await User.findOne({email: req.body.email});
  if(user){
    return res.status(400).json({message:"Email is already registered"})
  }


const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(req.body.password ,salt);
 
user = new User({
  username: req.body.username,
  email: req.body.email,
  password: hashedPassword
})

await user.save();


// @TODO - sending email (verify account)

res.status(201).json({message: "your registerd successfully, please log in"})

});


/**
 * @desc login user
 * @route /api/auth/login
 * @method Post
 * @access public
 */


module.exports.loginUserCtrl = asyncHandler (async (req,res)=>{

    // 1.validation
    const {error }= validateLoginUser(req.body)
    if(error){
      return res.status(400).json({message : error.details[0].message})
    }

    // 2. is user exist in Db ?
    let user = await User.findOne({email: req.body.email});
    if(!user){
      return res.status(400).json({message: "invalid email or password"});
    }

    // 3. check the password
    const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
    if(!isPasswordMatch){
      return res.status(400).json({message: "invalid password"});
    }

    // @TODO - sending email ( verify account if not verified)

    // 4. generate token (jwt)
    const token = user.generateAuthToken();

    // 5. response to client
    res.status(200).json({
      _id: user._id,
      isAdmin : user.isAdmin,
      profilePhoto : user.profilePhoto,
      token,
    })
});
