import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "./CreatePost.css";
import SendingLoader from "../../Components/SendingLoader/SendingLoader";
import { usePostsContext } from "../../hooks/usePostsContext";
import { useActiveUserContext } from "../../hooks/useActiveUserContext";

const CreatePost = () => {
  const [selectedSizes, setSelectedSizes] = useState([]);

  const { dispatch } = usePostsContext();
  const { activeUser } = useActiveUserContext();
  const navigate = new useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [size, setsize] = useState("");
  const [price, setprice] = useState("");
  const [gender, setgender] = useState("woman");
  const [category, setcategory] = useState("tshirt");
  const [color, setcolor] = useState("white");
  let [blogImage, setBlogImage] = useState([]);
  const [prevImage, setPrevImage] = useState([]);
  const [imageSelected, setImageSelected] = useState(false)
  const [sending, setSending] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    setSending(true);

    let formdata = new FormData();

    formdata.append("title", title);
    formdata.append("description", description);
    formdata.append("price", price);
    formdata.append("gender", gender);
    formdata.append("category", category);
    formdata.append("size", selectedSizes.join(","));
    formdata.append("color", color);
    formdata.append("blogImage", blogImage);
    formdata.append("activeUserId", activeUser._id);

    axios
      .post("/api/posts/create-post/admin", formdata, {
        headers: {
          "Content-type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.status === 200) {

          setSending(false);

          dispatch({type :"CREATE_POST", payload : res.data.post}); 


          Swal.fire("Greate", res.data.msg, "success");
         
          navigate("/", { replace: true });
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

  return (
   <>
    <div className="create_post_container">
      <form encType="multipart/form-data" className="createPostForm" onSubmit={handleFormSubmit}>
        <div className="create_post_heading_wrapper">
          <h2 className="create_post_heading">Create New Product</h2>
        </div>

        <div className="input_field">
          <label htmlFor="#">Title: </label>
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
          <label htmlFor="#">Description: </label>
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
          <label htmlFor="#">Select gender: </label>
          <select
            name="gender"
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
              setcategory(selectedcategory);
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
      <label>Size: </label>
      <div>
        <label>
          <input
            type="checkbox"
            name="size"
            value="XS"
            onChange={(e) => {
              const selectedSize = e.target.value;
              setSelectedSizes((prevSelectedSizes) => {
                if (e.target.checked) {
                  return [...prevSelectedSizes, selectedSize];
                } else {
                  return prevSelectedSizes.filter((size) => size !== selectedSize);
                }
              });
            }}
          />
          XS
        </label>
       
        <label>
          <input
            type="checkbox"
            name="size"
            value="S"
            onChange={(e) => {
              const selectedSize = e.target.value;
              setSelectedSizes((prevSelectedSizes) => {
                if (e.target.checked) {
                  return [...prevSelectedSizes, selectedSize];
                } else {
                  return prevSelectedSizes.filter((size) => size !== selectedSize);
                }
              });
            }}
          />
          S
        </label>

        <label>
          <input
            type="checkbox"
            name="size"
            value="M"
            onChange={(e) => {
              const selectedSize = e.target.value;
              setSelectedSizes((prevSelectedSizes) => {
                if (e.target.checked) {
                  return [...prevSelectedSizes, selectedSize];
                } else {
                  return prevSelectedSizes.filter((size) => size !== selectedSize);
                }
              });
            }}
          />
          M
        </label>

        <label>
          <input
            type="checkbox"
            name="size"
            value="L"
            onChange={(e) => {
              const selectedSize = e.target.value;
              setSelectedSizes((prevSelectedSizes) => {
                if (e.target.checked) {
                  return [...prevSelectedSizes, selectedSize];
                } else {
                  return prevSelectedSizes.filter((size) => size !== selectedSize);
                }
              });
            }}
          />
          L
        </label>

        <label>
          <input
            type="checkbox"
            name="size"
            value="XL"
            onChange={(e) => {
              const selectedSize = e.target.value;
              setSelectedSizes((prevSelectedSizes) => {
                if (e.target.checked) {
                  return [...prevSelectedSizes, selectedSize];
                } else {
                  return prevSelectedSizes.filter((size) => size !== selectedSize);
                }
              });
            }}
          />
          XL
        </label>
        <label>
          <input
            type="checkbox"
            name="size"
            value="Standart"
            onChange={(e) => {
              const selectedSize = e.target.value;
              setSelectedSizes((prevSelectedSizes) => {
                if (e.target.checked) {
                  return [...prevSelectedSizes, selectedSize];
                } else {
                  return prevSelectedSizes.filter((size) => size !== selectedSize);
                }
              });
            }}
          />
          Standart
        </label>

      </div>
    </div>

        <div className="input_field">
          <label htmlFor="#">Color: </label>
          <select
            name="color"
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

        <div className="input_field">
        <label htmlFor="#">Select post image : </label>
          <input
            type="file"
            onChange={(e) => {
              setBlogImage(e.target.files[0]);
              setPrevImage(URL.createObjectURL(e.target.files[0]));
              setImageSelected(true);
            }}

            required
          />
          <br />
          {imageSelected ?<img className="prev-image" width={200} height={150} src={prevImage} alt="image preview" /> : ""}
        </div>

        <div className="post_btn_wrapper">
          <button onClick={handlePostingLoading}>
          { sending ? <SendingLoader /> : "Create New Product" }
          </button>
        </div>
      </form>
    </div>
   </>
  );
};

export default CreatePost;
