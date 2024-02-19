import React, { useState } from 'react';
import "./update-comment.css"
import {toast} from "react-toastify"

const UpdateCommentModal = ({setUpdateComment}) => {
  

  const [text,setText] = useState("hello this is amazing");


  // Form submit handler
  const formSubmitHandler = (e) =>{
    
    e.preventDefault();
    if(text.trim()==="") return toast.error("please write a comment")



    console.log({text});


  }


  return (
    <div className='update-comment'>
      <form onSubmit={formSubmitHandler} className="update-comment-form">
        <abbr title="close">
          <i onClick={()=> setUpdateComment(false)} className="bi bi-x-circle-fill update-comment-form-close"></i>
        </abbr>
        <h1 className="update-comment-title">Edit Comment</h1>
        <input 
        type='text'
        className='update-comment-input'
        value={text}
        onChange={(e) => setText(e.target.value)}
        />
    
        <button className='update-comment-btn' type='submit'>Edit Comment</button>
      </form>

      
    </div>
  );
}

export default UpdateCommentModal;
