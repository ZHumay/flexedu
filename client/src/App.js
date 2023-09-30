import { Routes, Route } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import Navbar from "./Components/Navbar/Navbar";
import Login from "../src/Pages/Login/Login";
import Register from "../src/Pages/Register/Register";
import Home from "../src/Pages/Home/Home";
import CreatePost from "./Pages/CreatePost/CreatePost";
import PrivateRoute from "./Pages/PrivateRoute/PrivateRoute";
import Profile from "./Pages/Profile/Profile";
import SinglePost from "./Pages/SinglePost/SinglePost";
import UpdatePost from "./Pages/UpdatePost/UpdatePost";
import PageNotFound from "./Pages/PageNotFound/PageNotFound";
import { useDispatch } from "react-redux";
import { SET_POSTS } from "./store/postsSlice";
import Woman from "./Pages/Woman/Woman";
import Man from "./Pages/Man/Man";
import Contact from "./Pages/Contact/Contact";
import Shop from "./Pages/Shop/Shop";
import { VerifyPage } from "./Pages/Verify/VerifyPage";
import Basket from "./Pages/Basket/Basket";
import { useActiveUserContext } from "./context/activeUserContext";
import Myorders from "./Pages/MyOrders/Myorders";
import Wardrobe from "./Pages/Wardrobe/Wardrobe";
import CreatePostUser from "./Pages/CreatePostUser/CreatePostUser";
import { ForgetPasswordPage } from "./Pages/ForgetPassword";
import { ChangePasswordPage } from "./Pages/ChangePassowrd/ChangePassowrd";
import Favourites from "./Pages/Favourites/Favourites";
import ProductsPage from "./Components/Products/ProductsPage";
import "./reset.css"

function App() {
  const dispatch = useDispatch();

  const fetchAllPosts = async () => {
    try {
      const res = await axios.get("/api/posts/posts");

      if (res.status === 200) {
        dispatch(SET_POSTS(res.data.posts));
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const { dispatchActiceUser } = useActiveUserContext();

  useEffect(() => {
    fetchAllPosts();

    // Sayfa yüklendiğinde veya uygulama başladığında depolama alanından "activeUser" değerini al
    const activeUserFromStorage = JSON.parse(localStorage.getItem("activeUser"));

    // Eğer "activeUser" değeri depolama alanında varsa, context içinde güncelle
    if (activeUserFromStorage) {
      dispatchActiceUser({ type: "GET_ACTIVE_USER", payload: activeUserFromStorage });
    }
  }, [dispatchActiceUser,dispatch]);


  return (
    <div className="App">
      {/* <Navbar /> */}

      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/verify" element={<VerifyPage/>}></Route>
        <Route path="/create-post" element={<CreatePost />}></Route>
        <Route path="/create-post/user" element={<CreatePostUser/>}></Route>
        <Route path="/woman" element={ <Woman />}></Route>
        <Route path="/man" element={ <Man />}></Route>
        <Route path="/contact" element={ <Contact />}></Route>
        <Route path="/shop" element={ <Shop />}></Route>
        <Route path="/wardrobe" element={<Wardrobe/>}></Route>
        <Route path="/wishlist" element={<Favourites/>}></Route>
        <Route path="/userorders" element={<ProductsPage/>}></Route>
        <Route path="/basket" element={ <Basket/>}></Route>
        <Route path="/update-post/:id" element={<UpdatePost />}></Route>
        <Route path="/profile/:id" element={<Profile />}></Route>
        <Route path="/post/:id" element={<SinglePost />}></Route>
        <Route path="/orders" element={<Myorders/>}></Route>
        <Route path="/forgetpassword" element={<ForgetPasswordPage />} />
    <Route path="/changepassword" element={<ChangePasswordPage />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;
