import React from 'react';
import {Link} from "react-router-dom"


const HeaderRight = () => {
  return (
    <div className="header-right">
    <Link className="header-right-link" to="/login">
      <i className="bi bi-box-arrow-in-right">
        <span>Login</span>
      </i>
    </Link>
    <Link className="header-right-link" to="/register">
      <i className="bi bi-person-plus">
        <span>Register</span>
      </i>
    </Link>
  </div>
  );
}

export default HeaderRight;
