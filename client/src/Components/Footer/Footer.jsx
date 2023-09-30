import React from "react";
import "./Footer.css";
import { useNavigate } from "react-router-dom";
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
function Footer() {

  const navigate=useNavigate()
  const clickshopwoman = () => {
    navigate("/woman");
  }
  const clickshopman=()=>{
    navigate("/man")
  }

  return (
    <>
      <div className="footer">
        <div className="footer_info-first">
          <h3  className="footerh3"> About us</h3>
         
          <p className="text">
          Estilo is one of the largest international fashion companies.
The customer is at the heart of our unique business model, which includes design, production, distribution and sales through our extensive retail network.
          </p>
        </div>
        <div className="footer_info-second">
<h3  className="footerh3">Categories</h3>
  <p className="category" onClick={clickshopwoman}>Woman</p>
  <br></br>
  <p className="category" onClick={clickshopman}>Man</p>

        </div>
        <div className="footer_info-third">
        <h3 className="footerh3">Contact us</h3>

  <p className="category">Contact </p>
  <br></br>
  <div className="contact">
                <h5>Support service</h5>
                <p>+994 77 522 53 00</p>
              </div>
        </div>
        <div className="footer_info-forth">
          <h3  className="footerh3">Follow us</h3>
          <div className=" row justify-center gap-x-2" >
                  <div className="col-3 flex items-start">
                    <a href="https://www.facebook.com/"><FacebookIcon className="text-3xl-f" style={{width:"27px",height:"40px"}} /></a>
                  </div>
                  <div className="col-3 flex items-start">
                    <a href="https://www.instagram.com/"><InstagramIcon className="text-3xl-i"  style={{width:"27px",height:"40px"}}/></a>
                  </div>
                  <div className="col-3 flex items-start">
                    <a href="https://twitter.com/"><TwitterIcon className="text-3xl-t"  style={{width:"27px",height:"40px"}}/></a>
                  </div>
                </div>
        </div>
      </div>
      <div className="copyright"></div>
    </>
  );
}

export default Footer;
