import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import "../Shop/shop.css";
import BlogPostCardHome from "../../Components/BlogPostCardHome/BlogPostCardHome";
import { useActiveUserContext } from "../../hooks/useActiveUserContext";
import { usePostsContext } from "../../hooks/usePostsContext";
import { useUsersContext } from "../../hooks/useUsersContext";
import { useCommentsContext } from "../../hooks/useCommentsContext";
import Footer from "../../Components/Footer/Footer";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CachedIcon from "@mui/icons-material/Cached";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import PaymentIcon from "@mui/icons-material/Payment";
import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Modal,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useAdminContext } from "../../context/AdminContext";
import Carousel from "../../Components/CarouselSwiper/Carousel";
import PageLoader from "../PageLoader/PageLoader";

function Shop() {
  const navigate = useNavigate();
  const { comments, dispatchComments } = useCommentsContext();
  const { posts, dispatch } = usePostsContext();
  const { activeUser, dispatchActiceUser } = useActiveUserContext();
  const { users, dispatchUsers } = useUsersContext();
  const [allPosts, setAllPosts] = useState();
  const [cate, setCate] = useState();
  const [gender, setgender] = useState();
  const { admin } = useAdminContext();
  const [isLoading, setIsLoading] = useState(true);
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [sortOrder, setSortOrder] = useState("lowToHigh"); // Default sorting order

  // Function to handle sorting order change
  const handleSortOrderChange = (order) => {
    setSortOrder(order);
    // Sort the products based on the selected order
    const sortedPosts = [...allPosts];
    if (order === "lowToHigh") {
      sortedPosts.sort((a, b) => a.price - b.price);
    } else if (order === "highToLow") {
      sortedPosts.sort((a, b) => b.price - a.price);
    }
    setAllPosts(sortedPosts);
  };
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "rgb(216, 216, 216)",
    boxShadow: 24,
    p: 4,
    outline: "none",
  };

  const filterCategory = (category) => {
    setCate(category);
    if (category === "all") {
      setAllPosts(posts);
    } else {
      const tempArray = posts.filter((post) => post.category === category);
      setAllPosts(tempArray);
    }
  };

  const filterColor = (color) => {
    if (color === "All") {
      setSelectedColor(null); // Reset the selected color
      setAllPosts(posts); // Show all posts
    } else {
      setSelectedColor(color);
      const tempArray = posts.filter((post) => post.color === color);
      setAllPosts(tempArray);
    }
  };

  const filterGender = (gender) => {
    setgender(gender);
    const tempArr = posts.filter((post) => post.gender === gender);
    setAllPosts(tempArr);
  };

  const handleColorModalOpen = () => {
    setIsColorModalOpen(true);
  };

  const handleColorModalClose = () => {
    setIsColorModalOpen(false);
  };
  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setIsColorModalOpen(false); // Close the modal
    // Implement logic to filter posts based on the selected color
  };

  useEffect(() => {
    console.log(activeUser);
    navigate("/shop", { replace: true });

    const fetchPosts = async () => {
      try {
        const res = await axios.get("/api/posts/posts/admin");

        if (res.status === 200) {
          setAllPosts(res.data.posts);
          dispatch({ type: "SET_POSTS", payload: res.data.posts.reverse() });
        } else {
          console.log(res.data.msg);
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [dispatch]);

  return (
    <>
      <div className="overview-shop">
        <span className="gender_item" onClick={() => filterCategory("all")}>
          All products
        </span>

        <span className="gender_item" onClick={() => filterGender("woman")}>
          Woman
        </span>

        <span className="gender_item" onClick={() => filterGender("man")}>
          Man
        </span>

        <button className="filterbtn" onClick={handleColorModalOpen}>
          <FilterListIcon
            style={{
              height: "20px",
              width: "20px",
              marginBottom: "-5px",
              marginRight: "6px",
              color: "#fff",
            }}
          />
          <span className="filter">Filter by Color</span>
        </button>
        <Modal
          open={isColorModalOpen}
          onClose={handleColorModalClose}
          aria-labelledby="color-modal-title"
          aria-describedby="color-modal-description"
        >
          <Box sx={{ ...modalStyle, width: 300 }}>
            <Typography id="color-modal-title" variant="h6" component="h2">
              Select Color
            </Typography>
            <Divider />
            <List>
              {[
                "All",
                "white",
                "black",
                "red",
                "green",
                "yellow",
                "pink",
                "blue",
                "gray",
                "orange",
                "beige",
                "purple",
                "brown",
              ].map((color) => (
                <ListItem key={color} button onClick={() => filterColor(color)}>
                  <ListItemIcon>
                    {color === "All" ? (
                      <span></span>
                    ) : (
                      <div
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          backgroundColor: color,
                          marginRight: 8,
                        }}
                      />
                    )}
                  </ListItemIcon>
                  <ListItemText primary={color} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Modal>

        <div className="select">
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={(e) => handleSortOrderChange(e.target.value)}
          >
            <option value="lowToHigh">Price: Low to High</option>
            <option value="highToLow">Price: High to Low</option>
          </select>
        </div>
      </div>
      {activeUser && !admin ? (
        <div className="shop">
          <div className="home">
            <div className="home_wrapper">
              <div className="leftHome">
                {isLoading ? (
                  <PageLoader />
                ) : allPosts?.length === 0 ? (
                  <p className="posts_not_found">
                    No Products of {cate} Category
                  </p>
                ) : (
                  allPosts?.map((post) => {
                    if (!selectedColor || post.color === selectedColor) {
                      return (
                        <BlogPostCardHome
                          key={post._id}
                          post={post}
                          color={post.color}
                        />
                      );
                    }
                  })
                )}
              </div>
              <div className="rightHome">
                <h2 className="catogory_heading">Categories</h2>
                <div className="categories_wrapper">
                  <span
                    className="category_item"
                    onClick={() => filterCategory("tshirt")}
                  >
                    Tshirts
                  </span>
                  <span
                    className="category_item"
                    onClick={() => filterCategory("dress")}
                  >
                    Dresses
                  </span>
                  <span
                    className="category_item"
                    onClick={() => filterCategory("blazer")}
                  >
                    Blazers
                  </span>
                  <span
                    className="category_item"
                    onClick={() => filterCategory("jean")}
                  >
                    Jeans
                  </span>
                  <span
                    className="category_item"
                    onClick={() => filterCategory("coat")}
                  >
                    Coats
                  </span>
                  <span
                    className="category_item"
                    onClick={() => filterCategory("short")}
                  >
                    Shorts
                  </span>
                  <span
                    className="category_item"
                    onClick={() => filterCategory("skirt")}
                  >
                    Skirts
                  </span>
                  <span
                    className="category_item"
                    onClick={() => filterCategory("sweater")}
                  >
                    Sweaters
                  </span>
                  <span
                    className="category_item"
                    onClick={() => filterCategory("bag")}
                  >
                    Bags
                  </span>{" "}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        navigate("/login")
      )}
      <h2 className="popular-products">Most popular products</h2>
      <Carousel />
      <Footer />
    </>
  );
}

export default Shop;
