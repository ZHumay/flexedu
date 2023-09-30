import React, { useContext, useEffect, useState } from "react";
import "./myorders.css";
import axios from "axios";
import { useActiveUserContext } from "../../context/activeUserContext";
import { BasketContext } from "../../context/BasketContext";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";


function Myorders() {
  const { activeUser } = useActiveUserContext();
  const [orderItems, setOrderItems] = useState([]); // Define a state variable to hold the order items
  const { basketItems } =useContext(BasketContext);
  const posts = useSelector((state) => state.post.posts);
  const { id } = useParams();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (activeUser) {

          const response = await axios.get(`/api/auth/user/${activeUser._id}/orderItems`);
          setOrderItems(response.data.orderItems); // Set the order items in the state   
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [activeUser]);

  return (
    <>
      <div className="bottomm">
        <div className="blog_postt_profile_wrapper">
          {orderItems.length > 0 ? (
            // Render order items if there are items in the orderItems array
            orderItems.map((order, orderIndex) => (
              <div className="orders" key={orderIndex}>
                {order.items?.length > 0 ? (
                  // Display order details if there are items in the items array
                  order.items.map((item, itemIndex) => (
                    <div className="blog_profile_postt" key={itemIndex}>
                      <img src={item.postImage} alt="" />
                      <div className="mid__title">
                        <p>{item.title}</p>
                        <p>Price: {item.price}$</p>
                        <p>Address: {order.address}</p>
                          <p>
                            Number of product: {item.productcountinbasket}
                          </p>
                          
                       
                       
                         
                      </div>
                    </div>
                  ))
                ) : (
                  // Render a message when there are no items in the items array
                  <p>No items found for this order.</p>
                )}
              </div>
            ))
          ) : (
            // Render a message when there are no orders
            <p>No orders found.</p>
          )}
        </div>

      </div>
    </>
  );
}

export default Myorders;
