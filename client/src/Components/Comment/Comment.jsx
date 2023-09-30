
import React, {useState, useEffect} from 'react'
import "./Comment.css"
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { Link, useParams } from "react-router-dom";
import { useCommentsContext } from '../../hooks/useCommentsContext';
import { useActiveUserContext } from '../../hooks/useActiveUserContext';
import PageLoader from '../../Pages/PageLoader/PageLoader';
import Cookies from 'js-cookie';

const Comment = ({comment, post}) => {

  const {comments, dispatchComments} = useCommentsContext();
  const {activeUser, dispatchActiceUser} = useActiveUserContext();
  const {id} = useParams();
  const [user, setUser] = useState();

  const handleCommentDelete = async (id) =>{
    try{

      const res = await axios.delete(`/api/comments/delete-comment/${id}`);

      if(res.status === 200){
        dispatchComments({type :"DELETE_COMMENT", payload : res.data.comment});
      }
      else{
        console.log("Post not deleted")
      }

    }
    catch(error){
      console.log(error.message);
    }
  }

  useEffect(() => {

    const fetchCommentAuthor = async () =>{
      try{
        const res = await axios.get(`/api/auth/user/${comment?.authorId}`);

        if(res.status === 200){
          setUser(res.data.user);
        }
  
      }catch(error){
        console.log(error.message);
      }
    }
    const fetchActiveUser = async () =>{
      try{

        if(Cookies.get("jwt")){
            const res = await axios.post("/api/auth/active-user", {token : Cookies.get("jwt")} );

            if(res.status === 200){
              dispatchActiceUser({type : "GET_ACTIVE_USER", payload : res.data.user});
            }
            
          }
        }
        catch(error){
          console.log(error.message);
        }
    }


  fetchActiveUser()

    fetchCommentAuthor();
    
  }, [id])

  return (
    <>
   {activeUser?(
    <div className='comment'>
      <div className="left">
        <Link to={`/profile/${user?._id}`}>
          <img src={user? user.profileImage : `https://www.freepik.com/free-photos-vectors/profile`} alt="comment Img" />
        </Link>
      </div>

      <div className="right">
        <div className="header_name_comment">
            {/* <div className='h1_cl'>
               <p>{user?.name} {post?.authorId === comment.authorId ? <span className='author_txt_txt'>Author</span> : ""}</p>
            </div> */}
            <div className='h1_cr'>
              {
              activeUser?._id === comment.authorId ?
              <p className='comment_del_com' onClick={() => handleCommentDelete(comment._id)}><DeleteIcon fontSize='small' className='comment_del'/></p>
              :
              ""
              }
            </div>
          
        </div>
        <div className={`comment_txt_wrapper ${activeUser?._id === comment.authorId ? 'comment_txt_wrapperr' : ''}`}>
    <p> {comment?.comment}</p>
</div>

        
      </div>
    </div>
    ):(
    <PageLoader/>
  )}
    </>
  
  )
}

export default Comment
