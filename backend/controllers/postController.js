const fs = require("fs");
const path = require("path");
const asyncHandler = require("express-async-handler");
const {
  Post,
  validateCreatePost,
  validateUpdatePost,
} = require("../models/Post");
const {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
} = require("../utils/cloudinary");
const { Comment } = require("../models/Comment");

/**
 * @desc Create New Post
 * @route /api/posts
 * @method POST
 * @access private (only logged in user)
 */

module.exports.createPostCtrl = asyncHandler(async (req, res) => {
  //1. validation for image
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "no images provided" });
  }
  //2.validation for data
  // const { error } = validateCreatePost(req.body);
  // if (error) {
  //   return res.status(400).json({ message: error.details[0].message });
  // }
  //3. upload photo

  const imageUploadPromises = req.files.map(async (file) => {
    const imagePath = path.join(__dirname, `../images/${file.filename}`);
    const result = await cloudinaryUploadImage(imagePath);
    fs.unlinkSync(imagePath);
    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  });

  const images = await Promise.all(imageUploadPromises);

  //4. create a new post and save it to DB
  const post = await Post.create({
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    location: req.body.location,
    user: req.user.id,
    images,
  });

  //5. send response to the client
  if (post) {
    res.status(201).json(post);
  }

  //6. Remove Image from the server
  fs.unlinkSync(imagePath);
});

/**
 * @desc Get All Posts
 * @route /api/posts
 * @method GET
 * @access public
 */

module.exports.getAllPostsCtrl = asyncHandler(async (req, res) => {
  const POST_PER_PAGE = 3;
  const { pageNumber, category } = req.query;
  let posts;

  if (pageNumber) {
    posts = await Post.find()
      .skip((pageNumber - 1) * POST_PER_PAGE)
      .limit(POST_PER_PAGE)
      .sort({ createdAt: -1 })
      .populate("user", "-password");
  } else if (category) {
    posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", "-password");

    if (posts.length > 0) {
      const matchingPosts = posts.filter((post) =>
        JSON.parse(post.category).some((cat) => cat.title === category)
      );
      posts = matchingPosts;
    }
  } else {
    posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", "-password");
  }

  res.status(200).json(posts);
});

/**
 * @desc Get Single Posts
 * @route /api/posts/:id
 * @method GET
 * @access public
 */

module.exports.getSinglePostsCtrl = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate("user", "-password")
    .populate("comments");

  if (!post) {
    return res.status(404).json({ message: "No post found" });
  }
  res.status(200).json(post);
});

/**
 * @desc Get Posts count
 * @route /api/posts/count
 * @method GET
 * @access public
 */
module.exports.getPostCountCtrl = asyncHandler(async (req, res) => {
  const count = await Post.find();
  res.status(200).json(count.length);
});

/**
 * @desc Delete Posts
 * @route /api/posts/:id
 * @method DELETE
 * @access private(only admin or owner of the post)
 */
module.exports.deletePostsCtrl = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({ message: "No post found" });
  }

  if (req.user.isAdmin || req.user.id === post.user.toString()) {
    await Post.findByIdAndDelete(req.params.id);
    await cloudinaryRemoveImage(post.image.public_id);

    await Comment.deleteMany({ postID: post._id });

    res
      .status(200)
      .json({ message: "Post has been deleted successflly", postId: post._id });
  } else {
    res.status(403).json({ message: "access denied, forbidden " });
  }
});

/**
 * @desc Update New Post
 * @route /api/posts/:id
 * @method PUT
 * @access private (only Owner Of the Post)
 */

module.exports.updatePostCtrl = asyncHandler(async (req, res) => {
  // 1. validation
  const { error } = validateUpdatePost(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  //2. Get the post from DB and check if th epost exist
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "The post does not exists" });
  }

  //3. Make sure user is owner of the post
  if (req.user.id !== post.user.toString()) {
    return res
      .status(403)
      .json({ message: "access denied, you are not allower" });
  }

  //4. Update Post
  const updatedPost = await Post.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
      },
    },
    { new: true }
  ).populate("user", "-password");

  //5. Send Response to client
  res.status(200).json(updatedPost);
});

/**
 * @desc Update Post Image
 * @route /api/posts/upload-image/:id
 * @method PUT
 * @access private (only Owner Of the Post)
 */
module.exports.updatePostImageCtrl = asyncHandler(async (req, res) => {
  // 1. validation
  if (!req.file) {
    return res.status(400).json({ message: "no image provided" });
  }

  //2. Get the post from DB and check if th epost exist
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "The post does not exists" });
  }

  //3. Make sure user is owner of the post
  if (req.user.id !== post.user.toString()) {
    return res
      .status(403)
      .json({ message: "access denied, you are not allower" });
  }

  //4. Delete the old image
  await cloudinaryRemoveImage(post.image.public_id);

  // 5. Upload new Photo
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  const result = await cloudinaryUploadImage(imagePath);

  //6. update image fill in the DB
  const updatedPost = await Post.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        image: {
          url: result.secure_url,
          public_id: result.public_id,
        },
      },
    },
    { new: true }
  );

  //7. Send Response to client
  res.status(200).json(updatedPost);

  //8. Remove image from the server
  fs.unlinkSync(imagePath);
});

/**
 * @desc Toggle Like
 * @route /api/posts/like/:id
 * @method PUT
 * @access private (only logged in user)
 */

module.exports.toggleLikeCtrl = asyncHandler(async (req, res) => {
  const loggedInUser = req.user.id;
  const { id: postId } = req.params;
  let post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({ message: "post not found" });
  }

  const isPostAlreadyLiked = post.likes.find(
    (user) => user.toString() === loggedInUser
  );

  if (isPostAlreadyLiked) {
    post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: {
          likes: loggedInUser,
        },
      },
      { new: true }
    );
  } else {
    post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: {
          likes: loggedInUser,
        },
      },
      { new: true }
    );
  }

  res.status(200).json(post);
});
