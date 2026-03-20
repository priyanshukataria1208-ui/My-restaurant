import React, { useState, useContext, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import api from "../lib/api";

const Navbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const profileRef = useRef(null);

  const navigate = useNavigate();
 
    
  const { accessToken, role, logout ,name} = useContext(AuthContext);

  // 🔹 Sync name with Redux state
 
  // 🔹 Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchCartCount = async () => {
      if (!accessToken || role === "guest") {
        setCartCount(0);
        return;
      }

      try {
        const res = await api.get("/v1/");
        setCartCount(res.data?.cart?.items?.length || 0);
      } catch {
        setCartCount(0);
      }
    };

    fetchCartCount();
  }, [accessToken, role]);

  if (!role) return null;

  const handleLogout = () => {
    logout();
    navigate("/Login");
  };
const displayname=name || (role==="guest" ?"Guest":"User")
  return (


    <nav className="navbar-glass" id="navbar">
      {/* LEFT */}
      <div className="nav-left">
        <Link className="logo-wrap" to="/">
          <img src="logo.png" alt="Comida Logo" className="logo-img" />
          <h1 className="logo-text">Comida</h1>
        </Link>
      </div>

      {/* RIGHT */}
      <ul className="nav-links">
        {role === "customer" && (
          <>
            <li className="profile-btn" id="homepagebtn">
              <Link to="/">
                <i className="fas fa-house"></i>
              </Link>
            </li>
            
            

            <li id="foodtitle">
              <Link to="/menu">Menu</Link>
            </li>

            {/* CART */}
            <li id="foodtitle" className="cart-icon">
              <Link to="/cartpage">
                🛒 Cart
                {cartCount > 0 && (
                  <span className="cart-badge">{cartCount}</span>
                )}
              </Link>
            </li>
          </>
        )}
        {role === "guest" && (
          <>
            <li className="profile-btn" id="homepagebtn">
              <Link to="/">
                <i className="fas fa-house"></i>
              </Link>
            </li>
             <li id="foodtitle">
              <Link to="/menu">Menu</Link>
            </li>
            

            </>)}

        {/* PROFILE */}
   {/* PROFILE */}
<li
  ref={profileRef}
  className="profile-btn"
  id="logoutbtn"
  onClick={() => setProfileOpen(!profileOpen)}
>
  👤 {role === "guest" ? "Guest" : displayname}

  {profileOpen && (
    <div className="profile-dropdown">
      {role !== "guest" && <span><Link to="/profilepage">Profile</Link></span>}
      {role !== "guest" && <span>Settings</span>}

      <span
        className="logout"
        onClick={handleLogout}
      >
        {role === "guest" ? "Exit Guest" : "Logout"}
      </span>
    </div>
  )}
</li>

      </ul>
    </nav>
  );
};

export default Navbar;
