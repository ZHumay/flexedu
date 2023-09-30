import React from "react";
import "./newproducts.css";
import { useNavigate } from "react-router-dom";
import { useAdminContext } from "../../context/AdminContext";
function NewProducts() {
    const navigate=useNavigate()
const {admin}=useAdminContext()

     
const handleImg=()=>{
    navigate("/shop")
}
  return (
    <>
          { !admin ? 
    ( 
      <>
    <img onClick={handleImg}  className='newimg' src={require("../../Images/Capturee.PNG")} alt="loader" />
    </>
) :( " ")
  
   }
    </>
  );
}

export default NewProducts;
