const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const {
  User,
  validateEmail,
  validateNewPassword
} = require("../models/User.js");
const { response } = require("express");
const VerficationToken = require("../models/VerficationToken.js");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail.js");



/**
 * @desc Send Reset password Link
 * @route /api/password/reset-password-link
 * @method Post
 * @access public
 */

module.exports.sendRestPasswordLinkCtrl = asyncHandler(async (req, res) => {

  //Validation
  const {error} = validateEmail(req.body);
  if(error){
    return res.status(400).json({message: error.details[0].message});
  }

  //Get the user from DB by email
  const user = await User.findOne({email : req.body.email})
  if(!user){
    return res.status(404).json({message: "User with given email does not exist!"});

  }

  //Creating VerificationToken
  let verificationToken = await VerficationToken.findOne({userId:user._id});
  if(!verificationToken){
    verificationToken = new VerficationToken({
      userId : user._id,
      token: crypto.randomBytes(32).toString("hex"),
    })
    await verificationToken.save();
  }

  //Creating Link
  const link = `${process.env.CLIENT_DOMAIN}/reset-password/${user._id}/${verificationToken.token}`;

  //Creating HTML template
  const htmlTemplate = `
     <a href="${link}">Click here to reset your password</a>
  `;

  //Sending Email
  await sendEmail(user.email, "Reset Password", htmlTemplate);



  //Response to client
  res.status(200)
  .json({
    message: "Password reset link sent to your email, please check your email address",
  });

});



/**
 * @desc Send Reset password Link
 * @route /api/password/reset-password/:userId/:token
 * @method Get
 * @access public
 */

module.exports.getResetPasswordLinkCtrl = asyncHandler(async (req, res) => {

  //Get the user from DB by email
  const user = await User.findById(req.params.userId);
  if(!user){
    return res.status(400).json({message: "Invalid Link"});
  }

  const verficationToken = await VerficationToken.findOne({
    userId:user._id,
    token: req.params.token,
  })

  if(!verficationToken){
    return res.status(400).json({message: "Invalid Link"});
  }

  res.status(200).json({message:"Valid URL"})


});


/**
 * @desc Reset password
 * @route /api/password/reset-password/:userId/:token
 * @method POST
 * @access public
 */

module.exports.ResetPasswordCtrl = asyncHandler(async (req, res) => {

  //Validation
  const {error} = validateNewPassword(req.body);
  if(error){
    return res.status(400).json({message: error.details[0].message});
  }

  //Get the user from DB by email
  const user = await User.findById(req.params.userId);
  if(!user){
    return res.status(400).json({message: "Invalid Link"});
  }

  const verficationToken = await VerficationToken.findOne({
    userId:user._id,
    token: req.params.token,
  })

  if(!verficationToken){
    return res.status(400).json({message: "Invalid Link"});
  }

  if(!user.isAccountVerified){
    user.isAccountVerified=true;
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  user.password = hashedPassword;
  await user.save();

  await VerficationToken.findOneAndDelete({
    _id: verficationToken._id,
  });

  res.status(200).json({message: "password reset successfully, please login"})

});


