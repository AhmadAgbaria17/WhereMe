import React from 'react';
import {Link} from "react-router-dom"

const Navbar = ({toggle,setToggle}) => {
  return (
    <nav style={{clipPath:toggle && "polygon(0 0, 100% 0, 100% 100%, 0 100%)"}}  className="navbar">
    <ul className="nav-links">
      <Link className="nav-link" to="/" onClick={()=>{setToggle(false)}}>
        <i className="bi bi-house"></i>Home
      </Link>
      <Link className="nav-link" to="/posts" onClick={()=>{setToggle(false)}}>
        <i className="bi bi-stickies"></i>Posts
      </Link>
      <Link className="nav-link" to="/posts/create-post" onClick={()=>{setToggle(false)}}>
        <i className="bi bi-journal-plus"></i>Create
      </Link>
      <Link className="nav-link" to="/admin-dashboard" onClick={()=>{setToggle(false)}}>
        <i className="bi bi-person-check"></i>Admin Dashboard
      </Link>
      
    </ul>
  </nav>

  );
}

export default Navbar;
