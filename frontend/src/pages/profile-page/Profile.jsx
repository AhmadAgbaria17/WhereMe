import React, { useEffect, useState } from 'react';
import "./profile.css"
import PostList from '../../components/posts/postList';
import {posts} from "../../dummyData"
import { toast } from 'react-toastify';
import swal from 'sweetalert';
import UpdateProfileModal from './UpdateProfileModal';

const Profile = () => {

  const [file,setFile] = useState(null);
  const [updateProfile,setUpdateProfile] = useState(false);


  useEffect(()=>{
    window.scrollTo(0,0)
  },[])

  //Form Submit Handler
  const formSubmitHandler = (e) =>{
    e.preventDefault();
    if(!file) return toast.warning("there is no file");

    console.log("image uploated");
  }

  //Delete account handler
  const deleteAccountHandler = ()=>{
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this profile!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        swal("account has been deleted!", {
          icon: "success",
        });
      } else {
        swal("Something went wrong");
      }
    });
  }



  return (
    <section className="profile">
        <div className="profile-header">
          <div className="profile-image-wrapper">
            <img
             src={file ? URL.createObjectURL(file) : "/images/user-avatar.png" }
             alt="" 
             className="profile-image" 
             />
             <form onSubmit={formSubmitHandler}>
              <abbr title="choose profile photo">
                <label 
                htmlFor="file" 
                className='bi bi-camera-fill upload-profile-photo-icon'
                ></label>
              </abbr>
              <input
               style={{display:'none'}} 
               type="file" 
               name='file'
                id='file' 
                onChange={(e)=> setFile(e.target.files[0])}
                />
                
              <button className='upload-profile-photo-btn' type='submit'>Upload</button>
             </form>
          </div>

          <h1 className="profile-username">Ahmad Agbaria</h1>
          <p className="profile-bio">
            hello my name is Ahmad, i am a web developer
          </p>
          <div className="user-date-joined">
            <strong>Date Joined:</strong>
            <span>Fri Nov 04 22</span>
          </div>
          <button onClick={()=> setUpdateProfile(true)} className='profile-update-btn'>
            <i className='bi bi-file-person-fill'></i>
            Update Profile
          </button>
        </div>


        <div className="profile-posts-list">
          <h2 className='profile-post-list-title'>Ahmad posts</h2>
          <PostList posts={posts}/>
        </div>

        <button onClick={deleteAccountHandler} className='delete-account-btn'>Delete Your Account</button>

      {updateProfile && <UpdateProfileModal setUpdateProfile={setUpdateProfile}/>}


    </section>
  );
}

export default Profile;
