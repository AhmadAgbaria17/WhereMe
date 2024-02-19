import React, { useState } from "react";
import "./update-profile.css";

const user = {
  username: "Ahmad",
  bio: "hello my name is Ahmad",
};

const UpdateProfileModal = ({ post, setUpdateProfile }) => {
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio);
  const [password, setPassword] = useState("");

  // Form submit handler
  const formSubmitHandler = (e) => {
    e.preventDefault();

    const updatedUser = { username, bio };

    if (password.trim() !== "") {
      updatedUser.password = password;
    }

    console.log(updatedUser);
  };

  return (
    <div className="update-profile">
      <form onSubmit={formSubmitHandler} className="update-profile-form">
        <abbr title="close">
          <i
            onClick={() => setUpdateProfile(false)}
            className="bi bi-x-circle-fill update-profile-form-close"
          ></i>
        </abbr>
        <h1 className="update-profile-title">Update Your Profile</h1>
        <input
          type="text"
          className="update-profile-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          type="text"
          className="update-profile-input"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Bio"
        />

        <input
          type="password"
          className="update-profile-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />

        <button className="update-profile-btn" type="submit">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default UpdateProfileModal;
