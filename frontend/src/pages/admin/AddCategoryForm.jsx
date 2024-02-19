import React, { useState } from 'react';
import { toast } from 'react-toastify';

const AddCategoryForm = () => {

  const [title,setTitle] = useState("");

  //Form Submit Handler
  const formSubmitHandler = (e)=>{
    e.preventDefault();
    if(title.trim()==="") return toast.error("Category Title is required");

    console.log(title);
  }


  return (
    <div className='add-category'>
      <h6 className="add-category-title">Add New Category</h6>
      <form onSubmit={formSubmitHandler}>
        <div className="add-category-form-group">
          <label htmlFor="title">Category Title</label>
          <input
           type="text" 
           id="title" 
           name="title" 
           placeholder="Enter category title"
           value={title}
           onChange={(e) => setTitle(e.target.value)}
          
           />
        </div>
        <button className='add-category-btn' type='submit'>Add</button>
      </form>
    </div>
  );
}

export default AddCategoryForm;
