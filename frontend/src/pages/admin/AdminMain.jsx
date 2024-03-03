import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AddCategoryForm from './AddCategoryForm';
import {useDispatch,useSelector} from "react-redux";
import { fetchCategories } from '../../redux/apiCalls/categoryApiCall';
import { getUsersCount } from '../../redux/apiCalls/profileApiCall';
import { GetPostsCount } from '../../redux/apiCalls/postApiCall';

const AdminMain = () => {

  const dispatch = useDispatch();
  const {categories} = useSelector(state => state.category);
  const {usersCount} = useSelector(state => state.profile);
  const {postsCount} = useSelector(state => state.post);



  useEffect( ()=>{
    dispatch(fetchCategories());
    dispatch(getUsersCount());
    dispatch(GetPostsCount());
  },[dispatch]);


  return (
    <div className='admin-main'>
      <div className="admin-main-header">

        <div className="admin-main-card">
          <h5 className="admin-card-title">Users</h5>
          <div className="admin-card-count">{usersCount}</div>
          <div className="admin-card-link-wrapper">
            <Link className='admin-card-link' to="/admin-dashboard/users-table">
            See All Users
            </Link>
            <div className="admin-card-icon">
              <i className="bi bi-person"></i>
            </div>
          </div>
        </div>

        <div className="admin-main-card">
          <h5 className="admin-card-title">Posts</h5>
          <div className="admin-card-count">{postsCount}</div>
          <div className="admin-card-link-wrapper">
            <Link className='admin-card-link' to="/admin-dashboard/posts-table">
            See All Posts
            </Link>
            <div className="admin-card-icon">
              <i className="bi bi-file-post"></i>
            </div>
          </div>
        </div>

        <div className="admin-main-card">
          <h5 className="admin-card-title">Categories</h5>
          <div className="admin-card-count">
            {categories.length}
          </div>
          <div className="admin-card-link-wrapper">
            <Link className='admin-card-link' to="/admin-dashboard/categories-table">
            See All Categories
            </Link>
            <div className="admin-card-icon">
              <i className="bi bi-tag-fill"></i>
            </div>
          </div>
        </div>

        <div className="admin-main-card">
          <h5 className="admin-card-title">Comments</h5>
          <div className="admin-card-count">454</div>
          <div className="admin-card-link-wrapper">
            <Link className='admin-card-link' to="/admin-dashboard/comments-table">
            See All Comments
            </Link>
            <div className="admin-card-icon">
              <i className="bi bi-chat-left-text"></i>
            </div>
          </div>
        </div>
      </div>

      <AddCategoryForm/>
      
    </div>
  );
}

export default AdminMain;
