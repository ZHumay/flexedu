import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import Cookies from "js-cookie";
import SearchIcon from "@mui/icons-material/Search";
import { useActiveUserContext } from "../../hooks/useActiveUserContext";
import {useUsersContext} from "../../hooks/useUsersContext"
import SearchResult from "../SearchResult/SearchResult";
import Overlay from "../Overlay/Overlay";
import LoginIcon from '@mui/icons-material/Login';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import { useAdminContext } from "../../context/AdminContext";
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Avatar, Box, IconButton, Tooltip } from "@mui/material";
import DensityMediumIcon from '@mui/icons-material/DensityMedium';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

const Navbar = () => {
  const { activeUser } = useActiveUserContext();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [searchResultContainerStyle, setSearchResultContainerStyle] = useState("hideSearch");
  const { dispatchActiceUser } = useActiveUserContext();
  const {dispatchAdmin}=useAdminContext()
  const {admin}=useAdminContext()
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);


  const customBreakpoints = {
    xs: 321,
    xs2:330,
    xs3:618,
    md: 768,
    lg: 1279,
    xl: 1920, // Örnek bir büyük boyut
  };
  
  const theme = createTheme({
    breakpoints: {
      values: customBreakpoints,
    },
  });
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };


  const settings = [ 'Shop', 'Woman', 'Man', 'Contact','Add product','Wardrobe','Logout'];

  const handleLogout = () => {
    dispatchActiceUser({ type: "GET_ACTIVE_USER", payload: null });
    dispatchAdmin({ type: "GET_ADMIN", payload: null });

    localStorage.removeItem("activeUser");
    localStorage.removeItem("admin")
    Cookies.remove("jwt");
    navigate("/", { replace: true });
    window.location.reload();
  };

  const handleSearch = () => {
    if (searchResultContainerStyle === "hideSearch") {
      setSearchResultContainerStyle("showSearch");
    } else {
      setSearchResultContainerStyle("hideSearch");
    }
  };

 
console.log(admin);
  return (

    <ThemeProvider theme={theme}>

    <div className="navbar">
      {searchResultContainerStyle === "showSearch" && (
        <>
          <SearchResult
            searchValue={searchValue}
            className={searchResultContainerStyle}
          />
          <Overlay
            className={searchResultContainerStyle}
            onClick={handleSearch}
          />
        </>
      )}
       <Box sx={{ flexGrow: 0 }} className="box" >
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                 <DensityMediumIcon/> 
              </IconButton>
            </Tooltip>
            <Menu
        sx={{ mt: '45px' }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        {settings.map((setting) => (
          <MenuItem key={setting} onClick={setting.toLowerCase() === "logout" ? handleLogout : handleCloseUserMenu}>            <Link
                   to={
                    setting.toLowerCase() === "add product"
                      ? admin
                        ? "/create-post"
                        : "/create-post/user"
                      : setting.toLowerCase() === "logout"
                      ? "/"
                      : setting.toLowerCase()
                  }
              style={{
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              <Typography textAlign="center">{setting}</Typography>
            </Link>
          </MenuItem>
        ))}
      </Menu>
          </Box>

<div className="left">
  <div className="logo">
    <Link to="/">
      <span
        style={{
          color: "rgb(66,64,64)",
          fontSize: "20px",
          fontWeight: "700",
        }}
        className="logo-text"
      >
        EduFlex
      </span>
    </Link>
  </div>
  <div className="right">
    <div className="menu-link">
  
      {!admin ? (
        <>
            {/* <Link
        style={{
          color: "rgb(66,64,64)",
          fontSize: "17px",
          fontWeight: "700",
        }}
        to="/"
        className="ml"
      >
        Home
      </Link>
          <Link
            style={{
              color: "rgb(66,64,64)",
              fontSize: "17px",
              fontWeight: "700",
            }}
            to="/shop"
            className="ml"
          >
            Shop
          </Link>
          <Link
            style={{
              color: "rgb(66,64,64)",
              fontSize: "17px",
              fontWeight: "700",
            }}
            to="/woman"
            className="ml"
          >
            Woman
          </Link>
          <Link
            style={{
              color: "rgb(66,64,64)",
              fontSize: "17px",
              fontWeight: "700",
            }}
            to="/man"
            className="ml"
          >
            Man
          </Link>
          <Link
            style={{
              color: "rgb(66,64,64)",
              fontSize: "17px",
              fontWeight: "700",
            }}
            to="/contact"
            className="ml"
          >
            Contact
          </Link>
          <Link
        style={{
          color: "rgb(66,64,64)",
          fontSize: "17px",
          fontWeight: "700",
        }}
        to="/create-post/user"
        className="ml"
      >
        Add product
      </Link>
      <Link
        style={{
          color: "rgb(66,64,64)",
          fontSize: "17px",
          fontWeight: "700",
        }}
        to="/wardrobe"
        className="ml"
      >
        Wardrobe
      </Link> */}
        </>
      ) : 
      (
        <>
          {/* <Link
        style={{
          color: "rgb(66,64,64)",
          fontSize: "17px",
          fontWeight: "700",
        }}
        to="/"
        className="ml"
      >
        Home
      </Link>
      <Link
        style={{
          color: "rgb(66,64,64)",
          fontSize: "17px",
          fontWeight: "700",
        }}
        to="/create-post"
        className="ml"
      >
        Create
      </Link>

      <Link
        style={{
          color: "rgb(66,64,64)",
          fontSize: "17px",
          fontWeight: "700",
        }}
        to="/userorders"
        className="ml"
      >
        Orders
      </Link> */}

        </>
      )
      
      }


    
    </div>
  </div>
</div>


      {activeUser ? (
        <div className="center">
          {/* <div className="search_wrapper">
            <input
              type="text"
              placeholder="Search something ...."
              onChange={(e) => {
                setSearchValue(e.target.value.toLowerCase());
              }}
              onFocus={handleSearch}
            />
            <SearchIcon className="search-icon-nav" />
          </div> */}
        </div>
      ) : (
        ""
      )}

      <div className="rightt">
        <div className="menu-link">
          {activeUser ? (
            <>
            {!admin ? (
              <>
              {/* <Link
                to="/basket"
                style={{ color: "rgb(66,64,64)", fontSize: "17px", fontWeight: "700"}}
                className="mll-basket"
              >
                <ShoppingBagOutlinedIcon className="shopbag"/>
              </Link> */}
              </>
            ) : (null)}
               

              <Link
                to="/login"
                onClick={handleLogout}
                style={{ color: "rgb(66,64,64)", fontSize: "17px", fontWeight: "700",marginRight:"-5px"}}
                className="ml"
              >
                Logout
              </Link>
            
{/* 
              <Link to={`/profile/${activeUser && activeUser._id}`} className="nav_profile_img"  >
                <img
                  src={activeUser && activeUser.profileImage}
                  alt="Profile"
                  className="nav_profile_image"
                />
              </Link> */}

            </>
            
          ) : (
            <>
            <div className="righttt" >
            <Link
                to="/login"
                style={{ color: "rgb(66,64,64)", fontSize: "17px", fontWeight: "700",transform:"translateX(20px)",transform:{xs:"translateX(52px)" }}}
                className="ml-login"
              >
                Logout
                {/* <LoginIcon sx={{width:"30px",height:"20px", transform: {lg:"translateY(5px)", xs:"translateY(1px)"}}}/> */}
              </Link>
              {/* <Link
                to="/register"
                style={{ color: "rgb(66,64,64)", fontSize: "17px", fontWeight: "700",transform:{lg:"translateY(2px)" , md:"translateY(-1px)",xs:"translateY(-5px)",xs2:"translate(70px,2px)" }}}
                className="ml-register;"
              >
                Register
                <HowToRegIcon sx={{width:"30px",height:"20px", transform: {lg:"translateY(5px)", xs:"translate(60px,-20px)" ,md:"translate(7px,3px)",xs3:"translate(7px,3px)"}}}/>
              </Link> */}
              
            </div>
           
            </>
          )}
        </div>
      </div>
    </div>
    </ThemeProvider>
  );
};

export default Navbar;
