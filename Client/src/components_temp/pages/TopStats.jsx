import React, { useEffect, useState } from "react";
import axios from "axios";

/* Top 4 stat cards */
const TopStats = () => {

  const[stats,setStats]=useState([]);
  const[loading,setLoading]=useState(true)

 useEffect(() => {
const fetchStats = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/v1/stats");
    setStats([
      { title: "Orders", value: response.data.orders.toLocaleString(), subtitle: "weekly" },
      { title: "Customers", value: response.data.customers.toLocaleString(), subtitle: "total" },
      { title: "Menu", value: response.data.menu.toLocaleString(), subtitle: "items" },
      { title: "Income", value: `$${response.data.income.toLocaleString()}`, subtitle: "monthly" },
    ]);
    setLoading(false);
  } catch (err) {
    console.error(err);
    setLoading(false);
  }
};


  fetchStats(); // first fetch

  const interval = setInterval(fetchStats, 5000); // every 5 sec
  return () => clearInterval(interval); // cleanup on unmount
}, []);



return (
  <div className="topstats">
    {loading ? (
      <div>Loading stats...</div>
    ) : (
      stats.map((c, i) => (
        <div className="stat-card" key={i}>
          <div className="stat-left">
            
            <div className="stat-icon" />
            <div>
              
              <div className="stat-title">{c.title}</div>
              <div className="stat-value">{c.value}</div>
            </div>
          </div>
          <div className="stat-chart"> {/* mini sparkline placeholder */} </div>
        </div>
      ))
    )}
  </div>
);

};

export default TopStats;
