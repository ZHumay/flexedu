import axios from "axios";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
import SendingLoader from "../../Components/SendingLoader/SendingLoader";
import PersonIcon from '@mui/icons-material/Person';
import NoEncryptionIcon from '@mui/icons-material/NoEncryption';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import CheckIcon from '@mui/icons-material/Check';
import Cookies from "js-cookie";
const Register = () => {
  const navigate = new useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cPassword, setCpassword] = useState("");
  const [sending, setSending] = useState(false);
  const [confirmPassword,setConfirmPassword]=useState("")
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    try {
      const res = await axios.post(
        "/api/auth/post-register",
        {
          name: name,
          email: email,
          password: password,
          cPassword: cPassword,
          confirmPassword: confirmPassword,
        }
      );

      if (res.status === 200) {
        setSending(false);
        Swal.fire("Greate", res.data.msg, "success");

        navigate("/verify", {
          state: email,
        });
      }
    } catch (error) {
      console.log(error.message);
      Swal.fire("Oops !!", error.message, "info");
      navigate("/register", { replace: true });
    }
  };

  return (

    < div className="registerPage">

<img className="loginimg" src={require("../../Images/CaptureLogin.PNG")} />  
<div className="register">
      <form onSubmit={handleSubmit}>

             <div className="register_heading_wrapper">
                <h2 className="register_heading">Register</h2>
             </div>
       

        <div className="input_filed">
          <label htmlFor="#">Name <PersonIcon className="icons"/> </label>
          <input
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
            placeholder="Enter Name"
            required
          />
        </div>

        <div className="input_filed">
          <label htmlFor="#">Email <AlternateEmailIcon className="icons"/> </label>
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Enter Email"
            required
          />
        </div>

        <div className="input_filed">
          <label htmlFor="#">Password <NoEncryptionIcon className="icons"/> </label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="Password"
            required
          />
        </div>

        <div className="input_filed">
          <label htmlFor="#">Confirm Password <CheckIcon className="icons"/> </label>
          <input
            type="password"
            onChange={(e) => setCpassword(e.target.value)}
            value={cPassword}
            placeholder="Confirm Password"
            required
          />
        </div>

        <div className="register_button_container">
          <button type="submit">Register</button> 
          { sending ? <SendingLoader /> : "" }
        </div>

        <div className="bottom_form">
          <p>Already have an account ? <Link className="bottom-signup" to="/login">Sign In</Link></p>
        </div>
      </form>
    </div>
    </div>
  
    
  );

};

export default Register;
