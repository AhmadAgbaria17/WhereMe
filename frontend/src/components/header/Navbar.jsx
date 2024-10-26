import React from "react";
import { Link  } from "react-router-dom";
import { useSelector } from "react-redux";

const Navbar = ({ toggle, setToggle }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <nav
      style={{ clipPath: toggle && "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
      className="navbar"
    >
      <ul className="nav-links">
        <Link
          className="nav-link"
          to="/"
          onClick={() => {
            setToggle(false);
          }}
        >
          <i className="bi bi-house"></i>Home
        </Link>

    
        {user && (
          <Link
            className="nav-link"
            to="/posts/create-post"
            onClick={() => {
              setToggle(false);
            }}
          >
            <i className="bi bi-journal-plus"></i>Create
          </Link>
        )}

        {user?.isAdmin && (
          <Link
            className="nav-link"
            to="/admin-dashboard"
            onClick={() => {
              setToggle(false);
            }}
          >
            <i className="bi bi-person-check"></i>Admin Dashboard
          </Link>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
