import React, { useContext } from 'react'
import toast from "react-hot-toast";
import api from "./lib/api"; // path apne project ke hisaab se
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Register from './components/Register'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './components/Login';
import Navbar from './components/Navbar';
import UserProduct from './components/UserProduct';
import Welcome from "./components/welcome";
import Menu from "./components/Menu"
import TableData from './components/tabledata';
import Homepage from './components/Homepage';
import Admindashboard from './components/Admindashbord';
import { AuthContext,AuthProvider } from './components/context/AuthContext';

import Addfooditem from './components/Addfooditem';
import Adminfoodproduct from './components/Adminfoodproduct';
import Footer from './components/Footer';
import Cartpage from './components/Cartpage';
import Forgetpassword from './components/Forgetpassword';
import Resetpassword from './components/Resetpassword';
import Checkout from './components/checkout';
import Order from './components/Order';
import Protectedroutes from './components/Protectedroutes';
import Orderdetails from './components/Orderdetails';
import Openroutes from './components/Openroutes';
import Coupan from './components/Coupan';
import AdminAddCoupon from './components/Coupan';
import AdminCouponList from './components/Allcoupan';
import  Profilepages  from './components/Profilepages';



const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition

const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.lang = "en-IN"

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <MainApp />
      </Router>
    </AuthProvider>
  )
}

const MainApp = () => {
  const { accessToken, role } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    recognition.onresult = async (event) => {
      const text =
        event.results[event.results.length - 1][0].transcript.toLowerCase();

      console.log("VOICE:", text);

      // 🟢 OPEN MENU
      if (text.includes("open menu")) {
        navigate("/menu");
      }

      // 🟢 OPEN CART
      if (text.includes("open cart")) {
        navigate("/cartpage");
      }

      // 🟢 ADD PRODUCT
      if (text.includes("add")) {
        const foods = window.menuFoods || [];

        const foundItem = foods.find((item) =>
          text.includes(item.name.toLowerCase())
        );

        if (foundItem) {
          await api.post("/v1/addcart", {
            menuItemId: foundItem._id,
            userId: localStorage.getItem("userId"),
            quantity: 1,
          });

          toast.success(foundItem.name + " added to cart 🛒");
        } else {
          toast.error("Product not found");
        }
      }
    };
  }, [navigate]);


  return (
    <>
      {<Navbar />}

      <button
        onClick={() => recognition.start()}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 9999,
          padding: "12px 14px",
          borderRadius: "50%",
          fontSize: "18px",
          cursor: "pointer",
        }}
      >
        🎤
      </button>

      <Routes>
        <Route path="/Reg" element={<Register />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/usertable" element={<UserProduct />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/table" element={<TableData />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/" element={<Homepage />} />
        <Route path="/admindash" element={<Protectedroutes><Admindashboard /></Protectedroutes>} />
        <Route path='/admininsertform' element={<Addfooditem />} />
        <Route path='/adminfoodproduct' element={<Adminfoodproduct />} />

        <Route path='/cartpage' element={<Cartpage />} />
        <Route path="/forget" element={<Forgetpassword />} />
        <Route path='/checkout' element={<Checkout />} />
        <Route path="/reset-password/:token" element={<Resetpassword />} />
        <Route path="/coupan" element={<Coupan />} />
        <Route path='/allcoupan' element={<AdminCouponList />} />
        <Route path='/profilepage' element={<Profilepages />} />
        <Route path='/order' element={<Order />} />
        <Route path="/order/:id" element={<Orderdetails />} />

      </Routes>

      {/* Footer only for non-admin users */}




    </>
  );
};

export default App;
