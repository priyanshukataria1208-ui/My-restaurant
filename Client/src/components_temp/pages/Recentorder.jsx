import React, { useEffect, useState, useContext } from "react";
import axios from "axios";

import api from "../../lib/api";

const statusColor = {
  pending: "bg-yellow-500",
  confirmed: "bg-green-600",
  cancelled: "bg-red-600",
};

const Recentorders = () => {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("v1/order");
      console.log(res.data)
      setOrders(res.data.orders || []);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-slate-400">Loading orders...</p>;
  }

  if (!orders.length) {
    return <p className="text-slate-400">No recent orders found</p>;
  }

  return (
    <div className="bg-slate-800 p-5 rounded-xl shadow-lg">
      <h4 className="text-lg font-semibold mb-4 text-white">
        Recent Orders
      </h4>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-300">
          <thead className="text-xs uppercase bg-slate-700 text-slate-400">
            <tr>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Item</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Payment Status</th>
              <th className="px-4 py-3">Order Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.slice(0,5).map((o) => (
              <tr
                key={o._id}
                className="border-b border-slate-700 hover:bg-slate-700/40"
              >
                <td className="px-4 py-3">{o._id}</td>
                <td className="px-4 py-3">
                  {o.items?.[0]?.name || "Item"}
                </td>
                <td className="px-4 py-3">
                  {o.customerName || "Guest"}
                </td>
                <td className="px-4 py-3">₹ {o.finalAmount}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded text-xs text-white ${
                      statusColor[o.status?.toLowerCase()] || "bg-green-600"
                    }`}
                  >
                    {o.paymentStatus}
                  </span>
                </td>
                 <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded text-xs text-white ${
                      statusColor[o.status?.toLowerCase()] || "bg-yellow-600"
                    }`}
                  >
                    {o.orderStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Recentorders;
