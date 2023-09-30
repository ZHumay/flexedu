import React, { useContext, useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { usePostsContext } from "../../hooks/usePostsContext";
import { useActiveUserContext } from "../../hooks/useActiveUserContext";
import "./BlogPostCardHome.css";
import { BasketContext } from "../../context/BasketContext";
import { Button } from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { FavContext } from "../../context/FavContext";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useAdminContext } from "../../context/AdminContext";
import Rating from "@mui/material/Rating";
import StarRoundedIcon from "@mui/icons-material/StarRounded";

const BlogPostCardHome = ({ post, color }) => {
  const { activeUser } = useActiveUserContext();
  const { posts, dispatch } = usePostsContext();
  const { basketItems } = useContext(BasketContext);
  const { addToBasket, removeFromBasket } = useContext(BasketContext);
  const { favItems, addToFav, removeFromFav } = useContext(FavContext);
  const { admin } = useAdminContext();
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(post.likes.includes(activeUser?._id));
  const handleSettingId = async (currentPost_Id) => {
    try {
      // handleSettingId function logic can be implemented here if needed
    
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`/api/posts/delete-post/${id}`);

      if (res.status === 200) {
        dispatch({ type: "DELETE_POST", payload: res.data.post });
        window.location.reload();
      } else {
        console.log("Post not deleted, Something went wrong");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleLikeDislike = async (postId) => {
    try {
      const res = await axios.post(`/api/posts/like-dislike/${postId}`, {
        userId: activeUser?._id,
      });

      if (res.status === 200) {
        setLikeCount(res.data.liked ? likeCount + 1 : likeCount - 1);
        setIsLiked(res.data.liked);
      } else {
        console.log("Post not liked or disliked");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleClick = async (post) => {
    try {
      const itemToAdd = {
        _id: post._id,
        title: post.title,
        description: post.description,
        size: post.size,
        price: post.price,
        color: post.color,
        category: post.category,
        gender: post.gender,
        authorId: post.authorId,
        likes: post.likes,
        postImage: post.postImage,
        userType: post.userType,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      };

      // Sepete eklemek için kullanılan düğme
      const basketButton = document.getElementById(`basketButton-${post._id}`);

      if (!basketItems.some((item) => item._id === post._id)) {
        // Eğer sepete ekli değilse, sepete ekle
        const res = await axios.post(
          `/api/auth/user/${activeUser._id}/basketItems`,
          {
            newItem: itemToAdd,
          }
        );
        addToBasket(res.data);
      } else {
        // Eğer sepete ekliyse, sepetten çıkar
        const res = await axios.delete(
          `/api/auth/user/${activeUser._id}/basketItems`,
          {
            data: { itemToDelete: itemToAdd },
          }
        );
        removeFromBasket(itemToAdd);
      }
    } catch (error) {
      console.error("Error adding/removing item to/from basket:", error);
    }
  };

  const handleFav = async (post) => {
    try {
      const itemToAddFav = {
        _id: post._id,
        title: post.title,
        description: post.description,
        size: post.size,
        price: post.price,
        colorr: post.color,
        category: post.category,
        gender: post.gender,
        authorId: post.authorId,
        likes: post.likes,
        postImage: post.postImage,
        userType: post.userType,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      };

      if (!favItems.some((item) => item._id === post._id)) {
        // Eğer favorilerde değilse, favorilere ekle
        const res = await axios.post(
          `/api/auth/user/${activeUser._id}/favItems`,
          {
            newItem: itemToAddFav,
          }
        );
        addToFav(res.data);
      } else {
        // Eğer favorilerdeyse, favorilerden çıkar
        const res = await axios.delete(
          `/api/auth/user/${activeUser._id}/favItems`,
          {
            data: { itemToDelete: itemToAddFav },
          }
        );
        removeFromFav(itemToAddFav);
      }
    } catch (error) {
      console.error("Error adding/removing item to/from fav:", error);
    }
  };

  return (
    <div className={`blog-post-card-home ${color ? `color-${color}` : ""}`}>
      <div className="blog-post-home-image_wrapper">
        <Link
          to={`/post/${post?._id}`}
          onClick={() => handleSettingId(post?._id)}
        >
          <img src={post?.postImage} alt="post image" />
        </Link>{" "}
      </div>

      <div className="post_home_title">
        <p>{post?.title}</p>
        <span>
          {" "}
          {!admin && activeUser? (
            <>
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
                  <FavoriteIcon
                    style={{
                      width: "30px",
                      height: "20px",
                      color: "#DC4944",
                      marginLeft: "-42px",
                    }}
                  />
                ) : (
                  <FavoriteBorderIcon
                    style={{
                      width: "30px",
                      height: "20px",
                      color: "#DC4944", // Kırmızı renk
                      marginLeft: "-42px",
                    }}
                  />
                )}
              </Button>
            </>
          ) : (
            " "
          )}
        </span>
      </div>

      {activeUser && (
        <div className="post_home_bottom_wrapper">
          <div className="left">
            <Rating
              name="book-rating"
              precision={0.5}
              value={post.averageRating}
              sx={{ marginLeft: "-2px" }}
              icon={
                <StarRoundedIcon
                  style={{
                    color: "#F6DA2C ",
                    fontSize: "20px",
                  }}
                />
              }
              emptyIcon={
                <StarRoundedIcon
                  style={{
                    color: "#bab6b6",
                    fontSize: "20px",
                  }}
                />
              }
              readOnly
            />
          </div>

          <div className="right">
            {activeUser._id === post?.authorId ? (
              <>
                <p className="post_icon_wrapper">
                  <Link to={`/update-post/${post?._id}`}>
                    <EditIcon className="post_icon" />
                  </Link>
                </p>
                <p
                  className="post_icon_wrapper"
                  onClick={() => {
                    handleDelete(post?._id);
                  }}
                >
                  <Link to="/">
                    <DeleteIcon className="post_icon delete_post_icon_home" />
                  </Link>
                </p>
              </>
            ) : (
              <Button
                size="small"
                id={`basketButton-${post._id}`}
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
                    <RemoveShoppingCartIcon
                      style={{
                        paddingLeft: 10,
                        width: "50px",
                        height: "20px",
                        color: "#DE782E",
                      }}
                    />
                  </span>
                ) : (
                  // Show AddShoppingCartIcon if the item is not in the basket
                  <span className="btn-body">
                    <AddShoppingCartIcon
                      style={{
                        paddingLeft: 10,
                        width: "50px",
                        height: "20px",
                        color: "#DE782E",
                      }}
                    />
                  </span>
                )}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPostCardHome;
