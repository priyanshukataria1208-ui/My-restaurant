import React from "react";
import { FaChartLine, FaUtensils, FaList, FaShoppingCart, FaUsers, FaCog } from "react-icons/fa";
import { Link } from "react-router-dom";


const Sidebar = () => {
  return (
    <aside className="gd-sidebar">
      <div className="brand">
        <span className="brand-dot" />
        <strong>GoFood.</strong>
      </div>

      <nav className="gd-nav">
        <Link className="active" to="/admindashbord"><FaChartLine /> Dashboard</Link>
       <Link to="/adminfoodproduct"><FaUtensils /> Food Product</Link>
        <Link to="/order"><FaList /> Orders</Link>
        <Link to="/usertable"><FaList /> User</Link>
        <Link to="/table"><FaList /> Table</Link>
        <Link to="/coupan"><FaList /> Coupan</Link>
        <Link to="/allcoupan"><FaList/>All Coupan</Link>
   
        <Link to="/menu"><FaList /> Menu</Link>
        <Link to="/admininsertform"><FaList /> Add Food Item</Link>
       
        <h6 id="h6one">Admin</h6>

      </nav>
    </aside>
  );
};

export default Sidebar;
