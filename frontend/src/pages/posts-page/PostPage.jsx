import React, { useEffect } from "react";
import "./posts-page.css";
import PostList from "../../components/posts/postList";
import Sidebar from "../../components/sidebar/Sidebar";
import { posts, categories } from "../../dummyData";
import Pagination from "../../components/pagination/pagination";

const PostPage = () => {
  
  useEffect(() => { 
    window.scrollTo(0,0)
  },[]);
  return (
    <>
      <section className="posts-page">
        <PostList posts={posts} />
        <Sidebar categories={categories} />
      </section>

      <Pagination />
    </>
  );
};

export default PostPage;
