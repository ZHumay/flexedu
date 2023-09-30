import { Routes, Route } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import Login from "../src/Pages/Login/Login";
import Home from "../src/Pages/Home/Home";

import PageNotFound from "./Pages/PageNotFound/PageNotFound";
import { useDispatch } from "react-redux";

import { useActiveUserContext } from "./context/activeUserContext";

import "./reset.css"

function App() {
  const dispatch = useDispatch();

  const fetchAllPosts = async () => {
    try {
      const res = await axios.get("/api/posts/posts");

      if (res.status === 200) {
        // dispatch(SET_POSTS(res.data.posts));
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
        {/* <Route path="/register" element={<Register />}></Route> */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;
