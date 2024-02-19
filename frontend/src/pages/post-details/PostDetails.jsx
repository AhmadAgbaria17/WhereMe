import React, { useEffect, useState } from 'react';
import {Link, useParams} from "react-router-dom";
import {posts} from "../../dummyData";
import "./post-details.css";
import {toast,ToastContainer} from "react-toastify";
import AddComment from '../../components/comments/AddComment';
import CommentList from '../../components/comments/CommentList';
import swal from "sweetalert"
import UpdatePostModal from './UpdatePostModal';


const PostDetails = () => {
  const {id} = useParams();
  const post = posts.find(post => post._id === parseInt(id));

  const [file,setFile] = useState(null);
  const [updatePost,setUpdatePost] = useState(false);

  
  useEffect(()=>{
    window.scrollTo(0,0)
  },[])


  // Update Image submit handler
  const updateImageSubmitHandler = (e)=>{
    e.preventDefault();
    if(!file) return toast.warning("there is no file!")


    console.log("image uploaded successfully")
  };

  // Delete post handler 
  const deletePostHandler = ()=>{
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this imaginary file!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        swal("post has been deleted!", {
          icon: "success",
        });
      } else {
        swal("Something went wrong");
      }
    });
  }



  

  return (
    <section className="post-details">
      <div className="post-details-image-wrapper">
        <img src={file ? URL.createObjectURL(file)  :post.image} alt="" className="post-details-image" />
        <form onSubmit={updateImageSubmitHandler}  className="update-post-image-form">
          <label htmlFor="file" className="update-post-label">
            <i className="bi bi-image-fill"></i>
            Select new image
          </label>
          <input 
          style={{display:"none"}} 
          type="file" 
          name='file' 
          id='file'
          onChange={(e)=> setFile(e.target.files[0])}
          />
          <button type='submit' >upload</button>
        </form>
      </div>
      <h1 className="post-details-title">{post.title}</h1>
      <div className="post-details-user-info">
        <img src={post.user.image} alt="" className="post-details-img-info" />
        <div className="post-details-user">
          <strong>
            <Link to="profile/1" >{post.user.username}</Link>
          </strong>
          <span>{post.createdAt}</span>
        </div>
      </div>
      <p className="post-details-description">
        {post.description}
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
         Quibusdam vero, ea laboriosam consectetur aperiam reprehenderit
          amet porro obcaecati dolorum quam, dolorem illum! Nostrum sapiente
           officiis ipsa. Quas natus omnis asperiores?
           Lorem ipsum dolor sit amet consectetur adipisicing elit.
         Quibusdam vero, ea laboriosam consectetur aperiam reprehenderit
          amet porro obcaecati dolorum quam, dolorem illum! Nostrum sapiente
           officiis ipsa. Quas natus omnis asperiores?
      </p>
      <div className="post-deatils-icon-wrapper">
        <div>
            <i className="bi bi-hand-thumbs-up"></i>
            <small>{post.likes.length} likes</small>
        </div>
        <div>
            <i onClick={()=> setUpdatePost(true)} className="bi bi-pencil-square"></i>
            <i onClick={deletePostHandler} className="bi bi-trash-fill"></i>
        </div>
      </div>

      <AddComment/>
      <CommentList/>
      {updatePost && <UpdatePostModal post={post} setUpdatePost= {setUpdatePost}/>}
    </section>
  );
}

export default PostDetails;
