import React, { useState , useEffect } from 'react';
import "./update-post.css"
import {toast} from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { updatePost } from '../../redux/apiCalls/postApiCall';
import { fetchCategories } from '../../redux/apiCalls/categoryApiCall';


const UpdatePostModal = ({post,setUpdatePost}) => {

  const {categories} = useSelector(state => state.category);
  const dispatch = useDispatch();


  const [title,setTitle] = useState(post.title);
  const [description,setDescription] = useState(post.description);
  const [category,setCategory] = useState(post.category);


  // Form submit handler
  const formSubmitHandler = (e) =>{
    
    e.preventDefault();
    if(title.trim()==="") return toast.error("Post Title is required")
    if(description.trim()==="") return toast.error("Post Description is required")



    dispatch(updatePost({title,description}, post?._id));
    setUpdatePost(false);

  }

  useEffect(()=>{
    dispatch(fetchCategories())
  },[dispatch]);



  return (
    <div className='update-post'>
      <form onSubmit={formSubmitHandler} className="update-post-form">
        <abbr title="close">
          <i onClick={()=> setUpdatePost(false)} className="bi bi-x-circle-fill update-post-form-close"></i>
        </abbr>
        <h1 className="update-post-title">Update Post</h1>
        <input 
        type='text'
        className='update-post-input'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        />
        
        <textarea
         className='update-post-textarea'
          rows="5"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        <button className='update-post-btn' type='submit'>Update Post</button>
      </form>

      
    </div>
  );
}

export default UpdatePostModal;
