import React from "react";
import "./home.css";
import { posts ,categories } from "../../dummyData";
import PostList from "../../components/posts/postList";
import Sidebar from "../../components/sidebar/Sidebar";
import {Link} from "react-router-dom";

const Home = () => {
  return (
    <section className="home">
      <div className="home-hero-header">
        <div className="home-hero-header-layout">
          <h1 className="home-title">Welcome to WhereMe</h1>
        </div>
      </div>

      <div className="home-latest-post">Latest Posts</div>

      <div className="home-container">
        <PostList posts={posts.slice(0,3)} />
        <Sidebar categories={categories} />
      </div>

      <div className="home-see-posts-link">
        <Link className="home-link" to="/posts" >
          See All posts
          </Link>
      </div>
    </section>
  );
};

export default Home;
