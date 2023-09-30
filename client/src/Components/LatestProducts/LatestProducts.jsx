import React, { useEffect } from 'react'
import "./latestproducts.css"
import { Navigate, useNavigate } from 'react-router-dom'
import { useAdminContext } from '../../context/AdminContext'


function LatestProducts() {
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
    <h1> New upcoming products</h1>
    <img onClick={handleImg}  className='latestimg' src={require("../../Images/Capture.PNG")} alt="loader" />
    </>
) :( " ")
  
   }
  
    </>
  )
}

export default LatestProducts
