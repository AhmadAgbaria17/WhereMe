import React, { useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import "./admin-table.css";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import {useDispatch,useSelector} from "react-redux";
import { deleteProfile, getAllUsersProfile } from "../../redux/apiCalls/profileApiCall";


const UsersTable = () => {
  const dispatch = useDispatch();
  const {profiles,isProfileDeleted} = useSelector(state => state.profile);


  useEffect( ()=>{
    dispatch(getAllUsersProfile());
  
  },[dispatch,isProfileDeleted]);




  // Delete User handler 
  const deleteUserHandler = (userId)=>{
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this user!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        dispatch(deleteProfile(userId))
      

      } 
    });
  }

  return (
    <section className="table-container">
      <AdminSidebar />
      <div className="table-wrapper">
        <h1 className="table-title">Users</h1>
        <table className="table">
          <thead>
            <tr>
              <th>Count</th>
              <th>User</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((profile , index) => (
              <tr key={profile._id}>

                <td>{index+1}</td>

                <td>
                  <div className="table-image">
                    <img src={profile.profilePhoto?.url}
                    alt=""
                    className="table-user-image" />
                    <span className="table-username">
                      {profile.username}
                    </span>
                  </div>
                </td>

                <td>
                  {profile.email}
                </td>

                <td>
                  <div className="table-button-group">
                    <button>
                      <Link to={`/profile/${profile._id}`}>
                        View Profile
                      </Link>
                    </button>
                    <button onClick={()=>deleteUserHandler(profile._id)}>
                      Delete User
                    </button>
                  </div>
                </td>



              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default UsersTable;
