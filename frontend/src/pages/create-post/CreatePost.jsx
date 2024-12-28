import React, { useState, useEffect } from "react";
import "./create-post.css";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import {useNavigate } from "react-router-dom";
import { createPost, getPlaces } from "../../redux/apiCalls/postApiCall";
import { RotatingLines } from "react-loader-spinner";
import { fetchCategories } from "../../redux/apiCalls/categoryApiCall";

const CreatePost = () => {
  const dispatch = useDispatch();
  const { loading, isPostCreated ,locations} = useSelector((state) => state.post);
  const { categories } = useSelector((state) => state.category);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState([]);
  const [file, setFile] = useState([]);
  const [locationTXT, setLocationTXT] = useState("");
  const [location, setLocation] = useState();
  const [showLocation, setShowLocation]= useState(false);
  


  

  // Function to handle form submission
  const formSubmitHandler = (e) => {
    e.preventDefault();
    
    if (title.trim() === "") return toast.error("Post Title is required");
    if (description.trim() === "")
      return toast.error("Post Description is required");
    if (file.length===0) return toast.error("Post Image is required");
    if (category.length===0) return toast.error("Post Category is required");
    if(!location || !location.description) return toast.error("Post location is required")

    

    const formData = new FormData();
    
    file.forEach((image)=>{
      formData.append("images",image);
    })
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", JSON.stringify(category));
    formData.append("location",JSON.stringify(location));
    
    dispatch(createPost(formData));
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (isPostCreated) {
      navigate("/");
    }
  }, [isPostCreated, navigate]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <section className="create-post">
      <h1 className="create-post-title">Create New Post</h1>
      <form onSubmit={formSubmitHandler} className="create-post-form">
        <div className="all-post-info">
          <div className="left-post-info">
            <input
              type="text"
              placeholder="Post Title"
              className="create-post-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              rows="5"
              className="create-post-textarea"
              placeholder="Post Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>

            <input
              type="text"
              placeholder="Location"
              className="create-post-input"
              value={locationTXT}
              onChange={(e) => {
                const inputValue = e.target.value;
                setLocationTXT(inputValue);
                if(inputValue.length>2){
                  dispatch(getPlaces(inputValue));
                  setShowLocation(true);
                }
                
                
              }}
            />
          {showLocation && locationTXT.length>2 && locations.predictions&& locations.predictions.length>0?(
              <div className="g-places">
              {locations.predictions.map((place,index)=>(
                <div onClick={()=>{
                  setLocationTXT(place.description)
                  setLocation(place)
                  setShowLocation(false);
                }} key={index} className="s-place">
                    {place.description}
                  </div>
              ))}
            </div>
          ):<></>}

          

          </div>

          <div className="right-post-info">
            <h2>Choose categories:</h2>

            <div className="group-button">
              {categories.map((cat) => (
                <div
                  className={
                    category.includes(cat)
                      ? "pressed-categoru-btn"
                      : "categoru-btn"
                  }
                  key={cat._id}
                  onClick={() => {
                    if (category.includes(cat)) {
                      setCategory(category.filter((item) => item !== cat));
                    } else {
                      setCategory([...category, cat]);
                    }
                  }}
                  value={cat.title}
                >
                  {cat.title}
                </div>
              ))}
            </div>

            <h2 style={{ marginTop: "15px" }}>Choose Photos:</h2>

            <div className="file-uploader-container">
              <input
                type="file"
                name="file"
                id="file"
                className="create-post-upload"
                multiple
                onChange={(e) => {
                  const newFiles = Array.from(e.target.files);
                  setFile((prevFiles) => {
                    const existingFiles = prevFiles.map((f) => `${f.name}-${f.size}`);
                    const uniqueFiles = newFiles.filter(
                      (file) => !existingFiles.includes(`${file.name}-${file.size}`)
                    );
                    return [...prevFiles, ...uniqueFiles];
                  });
                }}
                
              />

              {file.length > 0 && (
            
                  <div className="dropdown-content">
                    {file.map((img, index) => (
                      <div key={index} className="preview-item">
                        <div
                         className="delete-photo"
                         onClick={()=>{
                         setFile(file.filter((item, i) => i !== index))
                         }}
                         >X</div>
                        <img
                          src={URL.createObjectURL(img)}
                          alt={`preview-${index}`}
                          className="preview-image"
                        />
                      </div>
                    ))}
                  </div>
              )}
            </div>
          </div>
        </div>

        <button type="submit" className="create-post-btn">
          {loading ? (
            <RotatingLines
              visible={true}
              width="40"
              color="grey"
              strokeColor="white"
              strokeWidth="5"
              animationDuration="0.75"
              ariaLabel="rotating-lines-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          ) : (
            "Create Post"
          )}
        </button>
      </form>
    </section>
  );
};

export default CreatePost;
