import React from "react";
import Sidebar from "./pages/Slidebar";
import TopStats from "./pages/TopStats";
import Favourites from "./pages/FavouriteItems";
import RecentOrders from "./pages/Recentorder";


const Admindashboard = () => {
  return (
    <div className="gd-app">
      <Sidebar />

      <main className="gd-main">
        {/* HEADER */}
        <header className="gd-header">
          <h1>Dashboard</h1>
          <div className="gd-header-actions">
            <input className="search" placeholder="Search..." />
            <div className="avatar">P</div>
          </div>
        </header>

        {/* TOP STATS */}
        <TopStats />

        {/* GRAPH + FAVOURITES */}
        <section className="dashboard-grid">
          
          <Favourites />
        </section>

        {/* ORDERS + TARGET */}
        <section className="dashboard-grid bottom">
          <RecentOrders />

          <div className="card target-card">
            <h4>Daily Target Income</h4>
            <div className="donut">72%</div>
            <p>₹786.58 from ₹1,000</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Admindashboard;
