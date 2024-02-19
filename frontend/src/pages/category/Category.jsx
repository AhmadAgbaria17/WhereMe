import React, { useEffect } from 'react';
import "./category.css"
import { useParams } from 'react-router-dom';
import PostList from '../../components/posts/postList';
import {posts} from "../../dummyData";

const Category = () => {

  const {category} = useParams();

  useEffect(()=>{
    window.scrollTo(0,0);
  },[])



  return (
  <section className="category">
    <h1 className="category-title">posts based on {category}</h1>
    <PostList posts={posts}/>
  </section>
  );
}

export default Category;
