import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector , useDispatch } from "react-redux";
import { logoutUser } from "../../redux/apiCalls/authApiCall";

const HeaderRight = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [dropdown, setDropdown] = useState(false);

  

  return (
    <div className="header-right">
      {user ? (
        <>
          <div className="header-right-user-info">
            <span
              onClick={() => setDropdown((prev) => !prev)}
              className="header-right-username"
            >
              {user?.username}
            </span>
            <img
              src={user?.profilePhoto.url}
              alt="userphoto"
              className="header-right-user-photo"
            />

            {dropdown && (
              <div className="header-right-dropdown">
                <Link
                  to={`/profile/${user?._id}`}
                  className="header-dropdown-item"
                  onClick={() => setDropdown(false)}
                >
                  <i className="bi bi-file-person"></i>
                  <span>Profile</span>
                </Link>
                <div onClick={()=>{
                  setDropdown(false)
                  dispatch(logoutUser());
                }} 
                 className="header-dropdown-item">
                  <i className="bi bi-box-arrow-in-left">
                    <span>Logout</span>
                  </i>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default HeaderRight;
