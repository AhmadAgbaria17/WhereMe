import React, { useEffect } from 'react';
import "./category.css"
import { useParams , Link } from 'react-router-dom';
import PostList from '../../components/posts/postList';
import {useDispatch , useSelector} from "react-redux"
import { fetchPostsBasedOnCategory } from '../../redux/apiCalls/postApiCall';
import ClipLoader from "react-spinners/ClipLoader";



const Category = () => {
  const dispatch = useDispatch();
  const {postsCate,loading} = useSelector(state => state.post)

  const {category} = useParams();

  useEffect(()=>{
    dispatch(fetchPostsBasedOnCategory(category))
    window.scrollTo(0,0);
  },[category])

  if(loading) return (
    <div className="loading">
      <ClipLoader />
    </div>
  )


  return (
  <section className="category">
    {postsCate.length === 0 ?
    <>
          <h1 className="category-not-found">Posts with <span>{category}</span> category not found</h1>
          <Link to="/" className='category-not-found-link'>Go to posts page</Link>
    </>
    :
    <>
      <h1 className="category-title">posts based on {category}</h1>
    <PostList posts={postsCate}/>
    </>}
  
  </section>
  );
}

export default Category;
