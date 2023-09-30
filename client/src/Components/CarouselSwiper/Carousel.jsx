import React, { useEffect, useRef, useState } from "react";
import { usePostsContext } from "../../hooks/usePostsContext";
import SwiperCore, { Autoplay, Navigation, Pagination } from "swiper/core";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.min.css";
import "./carousel.css";
import { useCommentsContext } from "../../hooks/useCommentsContext";
import axios from "axios";
import Comment from "../Comment/Comment";
import Comments from "../Comments/Comments";
import { Link } from "react-router-dom";
import { useActiveUserContext } from "../../context/activeUserContext";
// import 'swiper/css/autoplay';

SwiperCore.use([Autoplay, Navigation, Pagination]);

function Carousel({ comment }) {
  const { posts } = usePostsContext();
  const popularPosts = posts.filter((post) => post.likes.length >= 5);
  const { comments, dispatchComments } = useCommentsContext();
  const { activeUser} = useActiveUserContext();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`/api/comments/all-comments`);
        if (res.status === 200) {
          dispatchComments({
            type: "SET_COMMENTS",
            payload: res.data.comments,
          });
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchComments();
  }, []);

  return (
    <div className="popular">
      <Swiper
        modules={[Autoplay]}
        spaceBetween={20}
        loop={true}
        slidesPerView={3}
        centeredSlides={true}
        autoplay={{ delay: "1500" }}
        navigation={true}
        className="mySwiper"
        style={{ padding: "20px 0" }}
        breakpoints={{
          320: {
            slidesPerView: 1,
          },
          768:{
            slidesPerView: 2,

          },
          1200: {
            slidesPerView: 3,
          },
         }}
      >
        {popularPosts.map((post, index) => (
          <SwiperSlide key={post._id} className={`cardd rounded-lg `}>
            <br></br>
            <p className="carousel_item_title">{post.title}</p>
            <br></br>
            <div className="item_carousel_img_wrapper">
              
              <Link to={`/post/${post?._id}`}>
                <img className="postimg" src={post.postImage} alt="Slide" />
              </Link>
            </div>
            <br></br>
            <div className="karusel-comment">
              {comments?.filter((comment) => comment.postId === post?._id)
                .length !== 0 ? (
                comments
                  ?.filter((comment) => comment.postId === post?._id)
                  .reverse()
                  .map((comment) => {
                    return (
                      <Comment
                        comment={comment}
                        post={post}
                        key={comment._id}
                      />
                    );
                  })
              ) : (
                <h4 className="no_comment_txt">Being first to post Comment</h4>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default Carousel;
