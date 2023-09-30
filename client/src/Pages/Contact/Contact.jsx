import React, { useRef } from "react";
import emailjs from "@emailjs/browser";
import styled from "styled-components";
import "../../Pages/Contact/contact.css"
import Footer from "../../Components/Footer/Footer";
import HouseIcon from '@mui/icons-material/House';
import MailIcon from '@mui/icons-material/Mail';
import CallIcon from '@mui/icons-material/Call';
import Swal from "sweetalert2";
// npm i @emailjs/browser

const Contact = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_oi9tqsp",
        "template_kge70hm",
        form.current,
        "T6tZe2qbRUwXaqmPo"
      )
      .then(
        (result) => {
          console.log(result.text);
          console.log("message sent");
          
        Swal.fire("Success", "Message sent successfully!", "success");
        form.current.reset();
        },
        (error) => {
          console.log(error.text);
        }
      );
  };

  return (
<>
    <section class="map-section">
    <iframe
  className="map"
  src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d24300.75708627206!2d49.8033069!3d40.41783005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2saz!4v1681770709020!5m2!1sen!2saz"
  width="990px"
  height="450"
  style={{ border: 0 }}
  allowFullScreen=""
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
></iframe>
       </section>
    <div className="footer-contact">

      
    <div className="contact-info">
      <div className="info1">
    
      <h3> <HouseIcon style={{width:"30px",height:"20px",transform:"translateY(4px)"}}/>California, United States</h3>
        <p className="infop">Santa Monica Boulevard</p>
      </div>
       <div className="info2">
       <h3> <CallIcon style={{width:"30px",height:"20px",transform:"translateY(4px)"}}/> 00 (440) 9865 562</h3>
        <p className="infop">Mon to Fri 9am to 6 pm</p>
       </div>
     <div className="info3">
     <h3 > <MailIcon style={{width:"30px",height:"20px",transform:"translateY(4px)"}}/> support@colorlib.com</h3>
        <p className="infop">Send us your query anytime!</p>
     </div>

      </div>

          <StyledContactForm className="form">
      <form ref={form} onSubmit={sendEmail}>
        <label className="label">Name</label>
        <input type="text" name="user_name" placeholder="Enter your name" />
        <label className="label">Email</label>
        <input type="email" name="user_email" placeholder="Enter your email" />
        <label className="label">Message</label>
        <textarea name="message" placeholder="Message..." />
        <input type="submit" value="Send" />
      </form>
    </StyledContactForm>

    </div>

    <Footer/>
    </>
 
  );
};

export default Contact;

// Styles
const StyledContactForm = styled.div`
  width: 400px;

  @media (min-width: 601px) and (max-width:605px) {
    width: 341px; /* Set width to 601px for screens 601px or wider */
  }
  form {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    width: 100%;
    font-size: 16px;

    input {
      width: 100%;
      margin-top:14px;
      height: 35px;
      padding: 7px;
      outline: none;
      border-radius: 5px;
      border: 1px solid rgb(220, 220, 220);


      &:focus {
        border: 2px solid #e08e53;
      }
    }

    textarea {
      max-width: 100%;
      min-width: 100%;
      width: 100%;
      max-height: 100px;
      min-height: 100px;
      padding: 7px;
      outline: none;
      border-radius: 5px;
      border: 1px solid rgb(220, 220, 220);
      margin-top:14px;

      &:focus {
        border: 2px solid #e08e53;
      }
    }

    label {
      margin-top: 1rem;
      color:gray
    }

    input[type="submit"] {
      margin-top: 2rem;
      cursor: pointer;
      background: #e08e53;
      color: white;
      border: none;
    }
  }
`;
