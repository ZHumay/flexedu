import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "./UpdatePost.css";
import { usePostsContext } from "../../hooks/usePostsContext";
import Footer from "../../Components/Footer/Footer";
import { useActiveUserContext } from "../../hooks/useActiveUserContext";

const UpdatePost = () => {
  const {posts, dispatch} = usePostsContext();
  const { activeUser } = useActiveUserContext();

  const { id } = useParams();


  const navigate = new useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [gender, setgender] = useState("woman");
  const [size, setsize] = useState("");
  let [blogImage, setBlogImage] = useState([]);
  const [price, setprice] = useState("");
  const [category, setcategory] = useState("tshirt");
  const [color, setcolor] = useState("white");

  const handleFormSubmit = (e) => {
    e.preventDefault();

    let formdata = new FormData();

    formdata.append("title", title);
    formdata.append("description", description);
    formdata.append("gender", gender);
    formdata.append("size", size);
    formdata.append("category", category);
    formdata.append("blogImage", blogImage);
    formdata.append("price", price);
    formdata.append("color", color);

    axios.patch(`/api/posts/update-post/${id}`, formdata, {
        headers: {
          "Content-type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.status === 200) {
          Swal.fire("Greate", res.data.msg, "success");
          dispatch({type : "UPDATE_POST", payload : res.data.post})

          navigate("/wardrobe", { replace: true });
        } else {
          console.log("Something wents wrong");
          Swal.fire("Oops", res.data.msg, "info");
        }
      })
      .catch((error) => {
        console.log(error);
        Swal.fire("Oops", "Something wents wrong", "info");
      });
  };

  const handlePostingLoading = (e) => {
    if (activeUser) {
      handleFormSubmit(e);
    } else {
      // User is not logged in, navigate to login page
      navigate("/login");
    }

  };

  const loadPost = async () =>{
    try{
       const res = await axios.get(`http://localhost:8000/api/posts/post/${id}`);

       if(res.status === 200){
          setTitle(res.data.post.title);
          setDescription(res.data.post.description);
          setgender(res.data.post.gender);
          setcolor(res.data.post.color)
          setprice(res.data.post.price)
       }
       else{
        console.log("Something wents wrong");
       }
    }
    catch(error){
      console.log(error.message);
    }
  }

  useEffect(()=>{
      loadPost();
  },[])

  return (
   <>
    <div className="create_post_container">
      <form encType="multipart/form-data" className="createPostForm" onSubmit={handleFormSubmit}>
        <div className="create_post_heading">
          <h2>Update Post</h2>
        </div>

        <div className="input_field">
          <label htmlFor="#">Title : </label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            placeholder="Title"
            required
          />
        </div>

        <div className="input_field">
          <label htmlFor="#">Description : </label>
          <textarea
            type="text"
            rows={5}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            placeholder="Description"
            required
          />
        </div>

        <div className="input_field">
          <label htmlFor="#">Select gender : </label>
          <select
            name="cars"
            onChange={(e) => {
              const selectedgender = e.target.value;
              setgender(selectedgender);
            }}
          >
            <option value="woman">Woman</option>
            <option value="man">Man</option>
          </select>
        </div>

        <div className="input_field">
          <label htmlFor="#">Select category : </label>
          <select
            name="category"
            onChange={(e) => {
              const selectedcategory = e.target.value;
              setgender(selectedcategory);
            }}
          >
            <option value="tshirt">tshirt</option>
            <option value="jean">jean</option>
            <option value="dress">dress</option>
            <option value="blazer">blazer</option>
            <option value="coat">coat</option>
            <option value="short">short</option>
            <option value="skirt">skirt</option>
            <option value="sweater">sweater</option>
            {/* <option value="shoes">shoes</option> */}
            <option value="bag">bag</option>



          
          </select>
        </div>

        <div className="input_field">
          <label htmlFor="#">Size: </label>
          <select
            name="size"
            onChange={(e) => {
              const selectedsize = e.target.value;
              setsize(selectedsize);
            }}
          >
            <option value="XS">XS</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
          </select>
        </div>


        <div className="input_field">
          <label htmlFor="#">Color : </label>
          <select
            name="cars"
            onChange={(e) => {
              const selectedcolor = e.target.value;
              setcolor(selectedcolor);
            }}
          >
          <option value="white">white</option>
            <option value="black">black</option>
            <option value="red">red</option>
            <option value="green">green</option>
            <option value="yellow">yellow</option>
            <option value="pink">pink</option>
            <option value="blue">blue</option>
            <option value="gray">gray</option>
            <option value="orange">orange</option>
            <option value="beige">beige</option>
            <option value="purple">purple</option>
            <option value="brown">brown</option>
          </select>
        </div>

        <div className="input_field">
          <label htmlFor="#">Price: </label>
          <input
            type="number"
            rows={5}
            value={price}
            onChange={(e) => {
              setprice(e.target.value);
            }}
            placeholder="Price"
            required
          />
        </div>


        <div className="post_btn_wrapper">
          <button onClick={handlePostingLoading}>
           Update Product
          </button>
        </div>
      </form>
    </div>
   </>
  );
};

export default UpdatePost;
