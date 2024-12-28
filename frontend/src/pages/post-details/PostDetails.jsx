import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "./post-details.css";
import { toast } from "react-toastify";
import AddComment from "../../components/comments/AddComment";
import CommentList from "../../components/comments/CommentList";
import swal from "sweetalert";
import ClipLoader from "react-spinners/ClipLoader";
import UpdatePostModal from "./UpdatePostModal";
import { useSelector, useDispatch } from "react-redux";
import {
  deletePost,
  fetchSinglePost,
  toggleLikePost,
  updatePostImage,
} from "../../redux/apiCalls/postApiCall";

const PostDetails = () => {
  const disptch = useDispatch();
  const { post,loading } = useSelector((state) => state.post);
  const { user } = useSelector((state) => state.auth);

  const { id } = useParams();

  const [file, setFile] = useState(null);
  const [updatePost, setUpdatePost] = useState(false);
  const [currentImg, setCurrentImg] = useState(0);
  const locationObj = post?.location ? JSON.parse(post.location) : null;
  const googleMapsLink = locationObj
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationObj.description)}&query_place_id=${locationObj.place_id}`
    : "#";
  
  useEffect(() => {
    window.scrollTo(0, 0);
    disptch(fetchSinglePost(id));
  }, [id, disptch]);

  // Update Image submit handler
  const updateImageSubmitHandler = (e) => {
    e.preventDefault();
    if (!file) return toast.warning("there is no file!");

    const formData = new FormData();
    formData.append("image", file);
    disptch(updatePostImage(formData, post?._id));
  };

  const navigate = useNavigate();

  // Delete post handler
  const deletePostHandler = () => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this post!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((isOk) => {
      if (isOk) {
        disptch(deletePost(post?._id));
        navigate(`/profile/${user?._id}`);
      }
    });
  };

  if (loading) return (
  
  <section className="loading">

      <ClipLoader />
    
    </section>


)

  return (
    <section className="post-details">
      <div className="top-post-details">
        <div className="post-details-user">
          <img
            src={post?.user.profilePhoto?.url}
            alt=""
            className="post-details-img-info"
          />
          <div className="name-date-info">
            <strong>
              <Link to={`/profile/${post?.user._id}`}>
                {post?.user.username}
              </Link>
            </strong>
            <span>{new Date(post?.createdAt).toDateString()}</span>
          </div>
        </div>

        {user?._id === post?.user?._id && (
          <div className="edit-delete-post-details">
            <i
              onClick={() => setUpdatePost(true)}
              className="bi bi-pencil-square icon"
            ></i>
            <i
              onClick={deletePostHandler}
              className="bi bi-trash-fill icon"
            ></i>
          </div>
        )}
      </div>

      <div className="post-details-image-wrapper">
        <img
          src={file ? URL.createObjectURL(file) : post?.images[currentImg].url}
          alt=""
          className="post-details-image"
        />

        <div className="all-mini-img">
          {post?.images.map((imgs, index) => (
            <img
              key={index}
              src={imgs.url}
              alt=""
              className={`mini-img ${
                currentImg === index ? "selected-img" : ""
              } `}
              onClick={() => {
                setCurrentImg(index);
              }}
            />
          ))}
        </div>
      </div>

      <h1 className="post-details-title">{post?.title}</h1>

      <p className="post-details-description">{post?.description}</p>

      <div className="post-deatils-icon-wrapper">
        <div>
          {user && (
            <i
              onClick={() => disptch(toggleLikePost(post?._id))}
              className={
                post?.likes.includes(user?._id)
                  ? "bi bi-hand-thumbs-up-fill"
                  : "bi bi-hand-thumbs-up"
              }
            ></i>
          )}
          <small>{post?.likes.length} likes</small>
        </div>

        <div className="icon-container">
          <a href={googleMapsLink} target="_blank" rel="noopener noreferrer" className="btn btn-google-maps">
            <i className="bi bi-geo-alt"></i>
          </a>
          <span className="tooltip-text">
            Location:{" "}
            {typeof post?.location === "string"
              ? JSON.parse(post.location).description
              : post?.location?.description || "N/A"}
          </span>
        </div>

        <div>
          {(Array.isArray(post?.category)
            ? post.category
            : JSON.parse(post?.category || "[]")
          ).map((cat, index) => (
            <Link
              key={index}
              className="post-item-category"
              to={`/posts/categories/${cat?.title}`}
            >
              {cat.title}
            </Link>
          ))}
        </div>
      </div>

      {user ? (
        <AddComment postId={post?.id} />
      ) : (
        <p className="login-to-comment">
          Please login to comment on this post!
          <Link className="login-comment-to" to={"/login"}>
            Login
          </Link>
        </p>
      )}

      <CommentList comments={post?.comments} />
      {updatePost && (
        <UpdatePostModal post={post} setUpdatePost={setUpdatePost} />
      )}
    </section>
  );
};

export default PostDetails;
