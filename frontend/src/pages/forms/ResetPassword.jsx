import React, { useState } from "react";
import "./form.css"
import { toast } from "react-toastify";

const ResetPassword = () => {

  const [password,setPassword]=useState("");




  //form submit Handler

  const formSubmitHandler = (e)=>{
    e.preventDefault();

    if(password.trim()==="") return toast.error("Password is required");

    console.log({password})
    
  }


  return (
    <section className="form-container">
      <h1 className="form-title">Reset Password</h1>
      <form onSubmit={formSubmitHandler} className="form">

  

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            New Password
          </label>
          <input 
          type="password" 
          className="form-input" 
          id="password"
          placeholder="Enter a new password"
          value={password}
          onChange={(e)=>{ setPassword(e.target.value) }}
          />
        </div>

      <button className="form-btn" type="submit">Submit</button>

      </form>

    </section>
  );
};

export default ResetPassword;
