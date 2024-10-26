import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./posts.css";
import ImageContainer from "./ImageContainer";

const PostItem = ({ post, username, userId }) => {
  const profileLink = userId
    ? `/profile/${userId}`
    : `/profile/${post?.user._id}`;

  const [currentImg, setCurrentImg] = useState(0);

  const handleNextImage = () => {
    setCurrentImg((curr) => (curr < post.images.length - 1 ? curr + 1 : curr));
  };

  const handlePrevImage = () => {
    setCurrentImg((curr) => (curr > 0 ? curr - 1 : curr));
  };

  return (
    <div className="post-item">
      <div className="post-item-info-wrapper">
        <div className="post-item-info">
          <div className="post-item-author">
            <Link className="post-item-profile" to={profileLink}>
              <div className="post-item-username">
                {" "}
                {username ? username : post?.user.username}
              </div>
              <img
                className="post-user-profile-photo"
                src={post?.user.profilePhoto.url}
                alt="user profile ph"
              />
            </Link>
          </div>
          <div className="post-item-date">
            {new Date(post?.createdAt).toDateString()}
          </div>
        </div>

        <div className="post-item-image-wrapper">
          <ImageContainer
            images={post.images}
            currentImg={currentImg}
            setCurrentImg={setCurrentImg}
            onNext={handleNextImage}
            onPrev={handlePrevImage}
          />
        </div>

        <div className="post-item-details">
          <h4 className="post-item-title">{post?.title}</h4>
          <div>
            {JSON.parse(post.category).map((cat)=>(
                <Link
                className="post-item-category"
                to={`/posts/categories/${cat?.title}`}
                >
                  {cat.title}
                </Link>
              ))
            }
          </div>
        </div>

        <p className="post-item-description">{post?.description}</p>

        <Link className="post-item-link" to={`/posts/details/${post?._id}`}>
          Read More..
        </Link>
      </div>
    </div>
  );
};

export default PostItem;
