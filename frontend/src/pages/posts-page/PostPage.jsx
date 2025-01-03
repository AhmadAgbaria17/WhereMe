 import React, { useEffect , useState } from "react";
import "./posts-page.css";
import PostList from "../../components/posts/postList";
import Sidebar from "../../components/sidebar/Sidebar";
import Pagination from "../../components/pagination/pagination";
import {useDispatch , useSelector} from "react-redux"
import { fetchPosts , GetPostsCount } from "../../redux/apiCalls/postApiCall";
import ClipLoader from "react-spinners/ClipLoader";


const POST_PER_PAGE = 3;


const PostPage = () => {

  const dispatch = useDispatch();
  const {postsCount , posts ,loading} = useSelector(state => state.post)

  const [currentPage , setCurrentPage] = useState(1);
  const pages = Math.ceil(postsCount/POST_PER_PAGE)
  
  useEffect(() => { 
    dispatch(fetchPosts(currentPage));
    window.scrollTo(0,0)
  },[currentPage]);

  useEffect(() => { 
    dispatch(GetPostsCount())
  },[]);

  if(loading) return(
    <div className="loading">
              <ClipLoader />

    </div>
  )

  return (
    <div className="main-post-page">
      <section className="posts-page">
        <PostList posts={posts} />
        <Sidebar />
      </section>

      <Pagination pages={pages}
       currentPage={currentPage}
       setCurrentPage={setCurrentPage}
       />
    </div>
  );
};

export default PostPage;
