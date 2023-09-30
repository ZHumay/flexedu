import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Shop/shop.css";
import BlogPostCardHome from "../../Components/BlogPostCardHome/BlogPostCardHome";
import { usePostsContext } from "../../hooks/usePostsContext";
import { useActiveUserContext } from "../../context/activeUserContext";
import { useNavigate } from "react-router-dom";
import { useAdminContext } from "../../context/AdminContext";
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
import FilterListIcon from "@mui/icons-material/FilterList";
import PageLoader from "../PageLoader/PageLoader";

const Woman = () => {
  const { posts } = usePostsContext();
  const { activeUser } = useActiveUserContext();
  const navigate = useNavigate();
  const [womanPosts, setWomanPosts] = useState([]);
  const [category, setCategory] = useState("all products"); // Kategori filtrelemesi için state
  const { admin } = useAdminContext();
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [sortOrder, setSortOrder] = useState("lowToHigh"); // Default sorting order
  const [isLoading, setIsLoading] = useState(true);

  // Function to handle sorting order change
  const handleSortOrderChange = (order) => {
    setSortOrder(order);
    // Sort the products based on the selected order
    const sortedPosts = [...womanPosts];
    if (order === "lowToHigh") {
      sortedPosts.sort((a, b) => a.price - b.price);
    } else if (order === "highToLow") {
      sortedPosts.sort((a, b) => b.price - a.price);
    }
    setWomanPosts(sortedPosts);
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
    const fetchWomanPosts = async () => {
      try {
        const res = await axios.get("/api/posts/posts/admin");

        if (res.status === 200) {
          let womanPostsArray = res.data.posts.filter(
            (post) => post.gender === "woman"
          );

          // Kategoriye göre filtreleme

          if (category === "all products") {
            let womanPostsArray = res.data.posts.filter(
              (post) => post.gender === "woman"
            );
            setWomanPosts(womanPostsArray)
          }
          if (category !== "all products") {
            womanPostsArray = womanPostsArray.filter(
              (post) => post.category === category
            );
          }

          // Filtreleme: Seçilen renge göre filtreleme
          if (selectedColor) {
            womanPostsArray = womanPostsArray.filter(
              (post) => post.color === selectedColor
            );
          }

          setWomanPosts(womanPostsArray);
        } else {
          console.log(res.data.msg);
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWomanPosts();
  }, [category]);

  const filterColor = (color) => {
    if (color === "All") {
      setSelectedColor(null); // Reset the selected color
      const filteredWomanPosts = posts.filter(
        (post) => post.gender === "woman"
      );
      setWomanPosts(filteredWomanPosts);
    } else {
      setSelectedColor(color);

      // Filter posts based on gender and selected color
      const tempArray = posts.filter(
        (post) => post.gender === "woman" && post.color === color
      );

      setWomanPosts(tempArray);
    }
  };

  return (
    <>
      <div className="overview-shop">
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
                ) : womanPosts?.length === 0 ? (
                  <p className="posts_not_found">No Products</p>
                ) : (
                  womanPosts?.map((post) => {
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
                    onClick={() => setCategory("tshirt")}
                  >
                    Tshirts
                  </span>
                  <span
                    className="category_item"
                    onClick={() => setCategory("dress")}
                  >
                    Dresses
                  </span>
                  <span
                    className="category_item"
                    onClick={() => setCategory("blazer")}
                  >
                    Blazers
                  </span>
                  <span
                    className="category_item"
                    onClick={() => setCategory("jean")}
                  >
                    Jeans
                  </span>
                  <span
                    className="category_item"
                    onClick={() => setCategory("coat")}
                  >
                    Coats
                  </span>
                  <span
                    className="category_item"
                    onClick={() => setCategory("short")}
                  >
                    Shorts
                  </span>
                  <span
                    className="category_item"
                    onClick={() => setCategory("skirt")}
                  >
                    Skirts
                  </span>
                  <span
                    className="category_item"
                    onClick={() => setCategory("sweater")}
                  >
                    Sweaters
                  </span>
                  {/* <span className='category_item' onClick={()=> setCategory("shoes")}>Shoes</span> */}
                  <span
                    className="category_item"
                    onClick={() => setCategory("bag")}
                  >
                    Bags
                  </span>
                  <span
                    className="category_item"
                    onClick={() => setCategory("all products")}
                  >
                    All products
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        navigate("/login")
      )}
    </>
  );
};

export default Woman;
