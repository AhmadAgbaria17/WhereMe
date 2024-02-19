import React from 'react';
import { Link } from 'react-router-dom';
import "./posts.css"

const PostItem = ({post}) => {
  return (
    <div className="post-item">
      <div className="post-itam-image-wrapper">
        <img src={post.image} alt='' className='post-item-image' />
      </div>

      <div className="post-item-info-wrapper">

        <div className="post-item-info">
          <div className="post-item-author">
            <strong>Author: </strong>
            <Link className='post-item-username' to="/profile/1">{post.user.username}</Link>
          </div>
          <div className="post-item-date">
            {new Date(post.createdAt).toDateString()}
          </div>
        </div>

        <div className="post-item-details">
          <h4 className="post-item-title">{post.title}</h4>
          <Link className='post-item-category' to={`/posts/categories/${post.category}`}>
          {post.category}
          </Link>
        </div>

        <p className="post-item-description">{post.description} 
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim sit illo ea
        rum voluptatem! Similique tenetur fuga nihemem ipsum dolor sit amet consectetur adipisicing elit. Enim sit illo ea
        rum voluptatem! Similique tenetur fuga nihil nisi ut suscipit dolore cup
        iditate, alias ex! Dolorum modi temporibus fuga hic aliquid. ipsum dolor sit amet consectetur adipisicing elit. Enim sit illo ea
        rum voluptatem! Similique tenetur fuga nihil nisi ut suscipit dolore cup
        iditate, alias ex! Dolorum modi temporibus fuga hic aliquid.il nisi ut suscipit dolore cup
        iditate, alias ex! Dolorum modi temporibus fuga hic aliquid.
        </p>

        <Link className='post-item-link' to={`/posts/details/${post._id}`}>
        Read More..</Link>


      </div>
    </div>
  );
}

export default PostItem;
