import React, { useEffect, useState} from "react";
import "./Comments.css";
import Comment from "../Comment/Comment";
import axios from "axios";
import { useActiveUserContext } from "../../hooks/useActiveUserContext";
import { useCommentsContext } from "../../hooks/useCommentsContext";
import PageLoader from "../../Pages/PageLoader/PageLoader";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";

const Comments = ({ post }) => {
  const {activeUser, dispatchActiceUser} = useActiveUserContext();
  const {id} = useParams();

  const [comment, setComment] = useState();
  const { comments, dispatchComments } = useCommentsContext();


  const handleComment = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`/api/comments/comment/${activeUser?._id}`, {
        postId: post._id,
        comment: comment,
      });

      if (res.status === 200) {
        dispatchComments({ type: "ADD_COMMENT", payload: res.data.comment });

        setComment("");
      } else {
        console.log("Comment not posted");
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`/api/comments/all-comments`);
        if (res.status === 200) {
          dispatchComments({ type: "SET_COMMENTS", payload: res.data.comments });
        }
      } catch (error) {
        console.log(error.message);
      }
    };
  
    fetchComments();
  }, [post._id]);
  

  return (
    <>
    { activeUser ? (
    <div className="comments_section">
      <h5 className="add_comment_txt">Add Comment</h5>

      <div className="comment_form_wrapper">
        <form onSubmit={handleComment}>
          <div className="input_field">
            <textarea
              type="text"
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
              }}
              placeholder="Enter Comment ....."
              required
            />
          </div>
          <div className="comment_btn_wrapper">
            <button type="submit">Comment</button>
          </div>
        </form>
      </div>

      <h2 className="comments_heading">Comments : </h2>

      <div className="comments_wrapper">
        {
          comments?.filter((comment) => comment.postId === post?._id).length !==
          0 ? (
            comments
              ?.filter((comment) => comment.postId === post?._id)
              .reverse()
              .map((comment) => {
                return <Comment comment={comment} post={post} key={comment._id} />;
              })
          ) : (
            <h4 className="no_comment_txt">Being first to post Comment</h4>
          )
        }
      </div>
    </div>
    ) :(
      <PageLoader/> 
    )}
    </>
  );
};

export default Comments;
