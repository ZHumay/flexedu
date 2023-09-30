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
import "./favourites.css";
import { FavContext } from "../../context/FavContext";
import axios from "axios";
import { useActiveUserContext } from "../../context/activeUserContext";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const Favourites = () => {
  //  const [total, setTotal] = useState(0);
  const { id } = useParams();

  const { addToFav, removeFromFav, favItems } =
    useContext(FavContext);
  const { activeUser } = useActiveUserContext();
  const { admin } = useAdminContext();


  const customBreakpoints = {
    xs: 320,
    xs2: 383,
    xs3:453,
    s: 490,
    s2: 530,
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
    xl: 1920,  // Örnek bir büyük boyut
  };

  const theme = createTheme({
    breakpoints: {
      values: customBreakpoints,
    },
  });
  const handleFav = async (post) => {
    try {
      const isInFav = favItems.some((item) => item._id === post._id);
  
      if (!isInFav) {
        const res = await axios.post(
          `/api/auth/user/${activeUser._id}/favItems`,
          {
            newItem: { ...post }, // Include the selected size in the post data
          }
        );
        
        addToFav(res.data);
      } else {
        const res = await axios.delete(
          `/api/auth/user/${activeUser._id}/favItems`,
          {
            data: { itemToDelete: post },
          }
        );
        removeFromFav(post);
      }
    } catch (error) {
      console.error('Error adding/removing item to/from fav:', error);
    }
  };
  


  const navigate = useNavigate();



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
              {favItems?.map((post, index) => (
                <Grid item key={index} xs={6} sm={6} md={4} lg={3}>
                  <Card
                    sx={{
                      height: "200px",
                      margin: {
                        xs: "10px 30px",
                        lg: "20px 30px 30px 62px",
                        md: "10px 30px 30px 30px",
                      },
                      width: {
                        xs: "260px",
                        md: "678px",
                        lg: "1400px",
                        s2: "270px",
                        s3:"410px",
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
                        xs3:"translate(55px,-30px)",
                        md: "translateX(14px)",
                        s: "translate(70px,-30px)",
                        s2: "translate(76px,-30px)",
                      },
                    }}
                  >
                      <Link to={`/post/${post?._id}`}>
                    <CardMedia
                       component="img"
                       height="140"
                       image={post.postImage}
                       sx={{
                         width: { xs: "299px", md: "190px", md2: "515px",md4:"366px",lg:"157px" },
                         margin: "0px",
                         height: { md: "200px", xs: "82px" },
                         alignSelf: "flex-start", // Align the image to the top left corner
                         objectFit: { xs: "contain" },
                         transform: { xs: "translateX(0px)" ,s3:"translateX(3px)"} ,md4:"translateX(-18px)" }}
                       alt={post.title}
                    />
                    </Link>
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
                      <Typography
                        variant="h6"
                        color="rgb(66,64,64)"
                        className="description"
                      >
                         {`${post.description}`}
                      </Typography>
                   
                    </CardContent>
                    <CardActions
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        width: { md: "960px", xs: "213" },
                      }}
                    >
                     
                     <Button
                        size="small"
                        variant="text"
                        className={
                         favItems.some((item) => item._id === post._id)
                            ? "remove-btn-fav"
                            : "add-btn-fav"
                        }
                        onClick={() => handleFav(post)}
                      >
                        {favItems.some((item) => item._id === post._id) ? (
                          // Show RemoveShoppingCartIcon if the item is in thefavItems
                            <DeleteIcon className="delete-icon" />
                        ) : (
                          // Show AddShoppingCartIcon if the item is not in the basket
                            <FavoriteBorderIcon
                              style={{
                                paddingLeft: 10,
                                width: "50px",
                                height: "20px",
                                color: "#e08e53",
                              }}
                            />
                        )}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          
          </>
        ) : (
          navigate("/login")
        )}
      </ThemeProvider>
    </>
  );
};

export default Favourites;
