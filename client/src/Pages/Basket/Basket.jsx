import React, { useContext, useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Container, Grid } from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAdminContext } from "../../context/AdminContext";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import "./basket.css";
import { BasketContext } from "../../context/BasketContext";
import axios from "axios";
import { useActiveUserContext } from "../../context/activeUserContext";
import Order from "../../Components/Order/Order";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useProductCount } from "../../context/ProductCountContext";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const Basket = () => {
  //  const [total, setTotal] = useState(0);
  const { id } = useParams();

  const { addToBasket, removeFromBasket, basketItems, total } =
    useContext(BasketContext);
  const { activeUser } = useActiveUserContext();
  const { productCounts, setProductCounts } = useProductCount();
  const [selectedSizes, setSelectedSizes] = useState({});
  const { admin } = useAdminContext();

  const customBreakpoints = {
    xs: 320,
    xs2: 383,
    xs3:453,
    xs4:424,
    xs5:478,
    s: 490,
    s2: 530,
    s4:561,
    s3:608,
    md2: 703,
    md3: 885,
    md4:703,
    md: 768,
    lg2: 915,
    lg3: 1013,
    lg4: 1173,
    lg5: 1245,
    lg: 1279,
    xl1: 1301,
    xl: 1920, // Örnek bir büyük boyut
  };

  const theme = createTheme({
    breakpoints: {
      values: customBreakpoints,
    },
  });
  const handleClick = async (post) => {
    try {
      const isInBasket = basketItems.some((item) => item._id === post._id);
  
      if (!isInBasket) {
        const res = await axios.post(
          `/api/auth/user/${activeUser._id}/basketItems`,
          {
            newItem: { ...post, selectedSize: selectedSizes[post._id] }, // Include the selected size in the post data
          }
        );
        
        addToBasket(res.data);
      } else {
        const res = await axios.delete(
          `/api/auth/user/${activeUser._id}/basketItems`,
          {
            data: { itemToDelete: post },
          }
        );
        removeFromBasket(post);
      }
    } catch (error) {
      console.error('Error adding/removing item to/from basket:', error);
    }
  };
  


  const navigate = useNavigate();

  const handleIncrementCount = async (postId) => {
    try {
      await axios.post(`/api/posts/post/${postId}/incrementOrderedCount`);
      setProductCounts((prevState) => ({
        ...prevState,
        [postId]: (prevState[postId] || 1) + 1,
      }));

    } catch (error) {
      console.error("Error incrementing ordered count:", error);
    }
  };

  const handleDecrementCount = async (postId) => {
    try {
      await axios.post(`/api/posts/post/${postId}/decrementOrderedCount`);
      setProductCounts((prevState) => {
        const currentCount = prevState[postId] || 0;
        const updatedCount = currentCount - 1;
        const newCount = updatedCount >= 0 ? updatedCount : 0;

        return {
          ...prevState,
          [postId]: newCount,
        };
      });
    } catch (error) {
      console.error("Error decrementing ordered count:", error);
    }
  };

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    basketItems.forEach((item) => {
      const count = productCounts[item._id] || 1;
      totalPrice += item.price * count;
    });
    return totalPrice;
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        {!admin ? (
          <>
            <Grid
              style={{
                display: "flex",
                flexDirection: "column",
                transform: "translateY(79px)",
              }}
              container
              spacing={4}
            >
              {basketItems?.map((post, index) => (
                <Grid item key={index} xs={6} sm={6} md={4} lg={3}>
                  <Card
                    sx={{
                      height: "200px",
                      margin: {
                        xs: "10px 30px",
                        lg: "20px 30px 30px 49px",
                        md: "10px 30px 30px 30px",
                      },
                      width: {
                        xs: "260px",
                        xs4:"312px",
                        s2: "350px",
                        xs3:"351px",
                        s:"395px",
                        md: "678px",
                        lg: "1400px",
                        s3:"410px",
                        s4:"431px",
                        md2: "479px",
                        lg2: "826px",
                        md3: "793px",
                        lg3: "913px",
                        lg4: "1088px",
                        lg5: "1169px",
                      }, // Set the width for mobile and wider screens
                      display: "flex",
                      flexDirection: { xs: "column", md: "row" },
                      justifyContent: "center",
                      alignItems: "center",
                      border: "0.5px solid #EDECEB",
                      boxShadow: "none",
                      backgroundColor: "rgb(247, 247, 247)",
                      transform: {
                        xs: "translate(0px,-30px)",
                        xs2: "translate(28px,-30px)",
                        xs3:"translate(35px,-30px)",
                        md: "translateX(14px)",
                        s: "translate(34px,-30px)",
                        s2: "translate(36px,-30px)",
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      image={post.postImage}
                      sx={{
                        width: { xs: "299px", md: "190px", md2: "515px",md4:"366px" },
                        margin: "0px",
                        height: { md: "200px", xs: "82px" },
                        alignSelf: "flex-start", // Align the image to the top left corner
                        objectFit: { xs: "contain" },
                        transform: { xs: "translateX(-20px)",lg:"translateX(-14px)",s: "translateX(25px)",xs5:"translateX(27px)",xs4:"translateX(7px)",s3:"translateX(53px)" ,s4:"translateX(63px)", md4:"translateX(-18px)",md2:"translateX(48px)"}}}
                      alt={post.title}
                    />
                    <CardContent
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: { md: "500px", xs: "140px" },
                        flexDirection: "column",
                        color: "rgb(66, 64, 64)",
                        padding: "5px",
                      }}
                    >
                      <Typography
                        gutterBottom
                        variant="h4" // Set variant based on screen size
                        component="div"
                        className="title"
                        style={{
                          fontSize: window.innerWidth <= 320 ? "10px" : "inherit",
                        }}
                      >
                        {post.title}
                      </Typography>
                      <Typography
                        variant="h6"
                        color="rgb(66,64,64)"
                        className="price"
                      >
                        Price: {`${post.price}$`}
                      </Typography>
                      <label htmlFor="size">Select size:</label>
                      <select
                        className="select"
                        name="size"
                        id={`${post._id}`}
                        value={selectedSizes[post._id] || ""} // Use selectedSizes[state_key] or empty string if not selected
                        onChange={(e) => {
                          setSelectedSizes((prevSelectedSizes) => ({
                            ...prevSelectedSizes,
                            [post._id]: e.target.value, // Update the selected size for the specific post
                          }));
                        }}
                      >
                        {post.size[0].split(",").map((item) => (
                          <option value={item.trim()} key={item}>
                            {item.trim()}
                          </option>
                        ))}
                      </select>
                    </CardContent>
                    <CardActions
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        width: { md: "960px", xs: "213" },
                      }}
                    >
                      <Button
                        style={{ marginRight: "-40px" }}
                        onClick={() => handleIncrementCount(post?._id)}
                        startIcon={
                          <AddIcon
                            sx={{
                              color: "#A1A1A1 ",
                              fontSize: { md: "27px", xs: "11px" },
                            }}
                          />
                        }
                      ></Button>

                      <Button
                        sx={{
                          color: "gray",
                          fontSize: { md: "16px", xs: "12px" },
                        }}
                      >
                        {productCounts[post?._id] || 1}
                      </Button>
                      <Button
                        style={{ marginLeft: "-20px" }}
                        onClick={() => handleDecrementCount(post?._id)}
                        startIcon={
                          <RemoveIcon
                            sx={{
                              color: "#A1A1A1 ",
                              fontSize: { md: "30px", xs: "13px" },
                            }}
                          />
                        }
                      ></Button>
                      <Button
                        size="small"
                        variant="text"
                        className={
                          basketItems.some((item) => item._id === post._id)
                            ? "remove-btn"
                            : "add-btn"
                        }
                        onClick={() => handleClick(post)}
                      >
                        {basketItems.some((item) => item._id === post._id) ? (
                          // Show RemoveShoppingCartIcon if the item is in the basket
                          <span className="btn-body">
                            <DeleteIcon className="delete-icon" />
                          </span>
                        ) : (
                          // Show AddShoppingCartIcon if the item is not in the basket
                          <span className="btn-body">
                            <AddShoppingCartIcon
                              style={{
                                paddingLeft: 10,
                                width: "50px",
                                height: "20px",
                                color: "#e08e53",
                              }}
                            />
                          </span>
                        )}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <div className="total">
              Total Price: {`${calculateTotalPrice()}$`}
            </div>
            <Order />
          </>
        ) : (
          navigate("/login")
        )}
      </ThemeProvider>
    </>
  );
};

export default Basket;
