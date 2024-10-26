const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const {
  User,
  validateRegisterUser,
  validateLoginUser,
} = require("../models/User.js");
const { response } = require("express");
const VerficationToken = require("../models/VerficationToken.js");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail.js");

/**
 * @desc register new user
 * @route /api/auth/register
 * @method Post
 * @access public
 */

module.exports.registerUserCtrl = asyncHandler(async (req, res) => {
  const { error } = validateRegisterUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).json({ message: "Email is already registered" });
  }
   
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  });

  await user.save();

  //sending email (verify account)
  //Creating new verficationToken and save it to DB
  const verficationToken = new VerficationToken({
    userId: user._id,
    token: crypto.randomBytes(32).toString("hex"),
  });
  await verficationToken.save();

  // Making the Link
  const link = `${process.env.CLIENT_DOMAIN}/users/${verficationToken.userId}/verify/${verficationToken.token}`;

  //putting the limk into an hTML template
  const htmlTemplate = `
<div>
  <p> Click on the link below to verift your email </p>
   <a href="${link}">Click here</a>
</div>
`;
  //sending email to user
  await sendEmail(user.email, "Verify Your Email Account", htmlTemplate);

  //sending email to client
  res
    .status(201)
    .json({
      message: "we sent to you an email, please verify your email address",
    });
});

/**
 * @desc login user
 * @route /api/auth/login
 * @method Post
 * @access public
 */

module.exports.loginUserCtrl = asyncHandler(async (req, res) => {
  // 1.validation
  const { error } = validateLoginUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // 2. is user exist in Db ?
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({ message: "invalid email or password" });
  }

  // 3. check the password
  const isPasswordMatch = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!isPasswordMatch) {
    return res.status(400).json({ message: "invalid password" });
  }

  if (!user.isAccountVerified) {
    let verficationToken = await VerficationToken.findOne({
      userId: user._id,
    });
    if (!verficationToken) {
      verficationToken = new VerficationToken({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      });
      await verficationToken.save();
    }

    // Making the Link
    const link = `${process.env.CLIENT_DOMAIN}/users/${verficationToken.userId}/verify/${verficationToken.token}`;

    //putting the limk into an hTML template
    const htmlTemplate = `
<div>
  <p> Click on the link below to verift your email </p>
   <a href="${link}">Click here</a>
</div>
`;
    //sending email to user
    await sendEmail(user.email, "Verify Your Email Account", htmlTemplate);

    return res
      .status(400)
      .json({
        message: "we sent to you an email, please verify your email address",
      });
  }

  // 4. generate token (jwt)
  const token = user.generateAuthToken();

  // 5. response to client
  res.status(200).json({
    _id: user._id,
    isAdmin: user.isAdmin,
    profilePhoto: user.profilePhoto,
    token,
    username: user.username,
  });
});

/**
 * @desc Verify user Account
 * @route /api/auth/:userId/verify/:token
 * @method Get
 * @access public
 */
module.exports.verifyUserAccountCtrl = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    return res.status(400).json({ message: "user invalid link " });
  }

  const verficationToken = await VerficationToken.findOne({
    userId: user._id,
    token: req.params.token,
  });

  if (!verficationToken) {
    return res.status(400).json({ message: "token invalid link" });
  }

  user.isAccountVerified = true;
  await user.save();

  await VerficationToken.findOneAndDelete({
    _id: verficationToken._id,
  });

  res.status(200).json({ message: "your account verified" });
});
