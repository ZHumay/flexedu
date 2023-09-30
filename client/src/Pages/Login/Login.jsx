import React, { useContext, useState } from "react";
import "./Login.css";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { useNavigate, Link } from "react-router-dom";
import SendingLoader from "../../Components/SendingLoader/SendingLoader";
// import NoEncryptionIcon from '@mui/icons-material/NoEncryption';
// import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
// import { useActiveUserContext } from "../../hooks/useActiveUserContext";
import { useAdminContext } from "../../context/AdminContext";
const Login = () => {
  const navigate = new useNavigate();
  // const{activeUser}=useActiveUserContext()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sending, setSending] = useState(false);
  // const { dispatchActiceUser } = useActiveUserContext();
  const {dispatchAdmin}=useAdminContext()



  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    try {
      const res = await axios.post("/api/auth/post-login", {
        email: email,
        password: password,
      });

      if (res.status === 200 && res.data.token) {
        setSending(false);
        Swal.fire("Greate", res.data.msg, "success");
        Cookies.set("jwt", res.data.token, { expires: 7 });
        // dispatchActiceUser({ type: "GET_ACTIVE_USER", payload: true });
        if (email === "zehmetihumay@gmail.com") {
          dispatchAdmin({ type: "GET_ADMIN", payload: true });
        } else {
          dispatchAdmin({ type: "GET_ADMIN", payload: false });
        }        navigate("/", { replace: true });
      } else {
        setSending(false);
        Swal.fire("Oops", res.data.msg, "info");
        navigate("/login", { replace: true });
      }
    } catch (error) {
      console.log(error.message);
      Swal.fire("Oops !!", error.message, "info");
      navigate("/login");
    }
  };

  return (
    <div className="loginPage">

<div className="image">
  <div className="image-container">
    <img className="loginimg" src={require("../../Images/Rectangle 1.png")} alt="EduFlex" />
    <div className="overlay-text"><img  src={require("../../Images/EduFlex logo.png")} alt="EduFlex" />
</div>
  </div>
</div>
   <div className="login">
      <form onSubmit={handleSubmit}>
        <div className="login_heading_wrapper">
          <h2 className="login_heading">Sign in</h2>
        </div>

        <div className="input_filed">
          <label htmlFor="#">Email  </label>
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Email"
            required
            style={{ color: "#B8BCD0" }}
          
          />
        </div>

        <div className="input_filed">
          <label htmlFor="#">Password 
          </label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="Create a password"
            required
            style={{ color: "#B8BCD0" }}
              />
        </div>

        <div className="login_button_container">
          <button type="submit">Get started</button>
          {sending ? <SendingLoader /> : ""}
        </div>

        {/* <div className="bottom_form">
          
        
          <div className="forgot">
            <Link style={{color:"white"}}  to="/forgetpassword"> Forgot password ?</Link>
          </div>
         
          <p className="signupP">
            Don't you have an account ? <Link className="bottom-signup" style={{color:"rgb(109, 157, 233)"}} to="/register">Sign Up</Link>
          </p>
        </div> */}
      </form>
    </div>
  </div>
    
  );
};

export default Login;