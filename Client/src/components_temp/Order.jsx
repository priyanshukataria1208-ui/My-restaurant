import React, { useEffect, useState } from "react";
import api from "../lib/api";
import { useNavigate, useSearchParams } from "react-router-dom";

const Order = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId"); // optional

  const statusColor = {
    pending: "bg-yellow-500",
    confirmed: "bg-green-600",
    cancelled: "bg-red-600",
    paid: "bg-green-600",
  };

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await api.get(
          `/v1/order?page=${page}&limit=${limit}${userId ? `&userId=${userId}` : ""}`
        );
        setOrders(res.data.orders || []);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        console.error(err);
        setOrders([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [page, userId]);

  if (loading) return <p className="text-slate-400">Loading orders...</p>;
  if (!orders.length) return <p className="text-slate-400">No recent orders found</p>;

  return (
    <div className="bg-slate-800 p-5 rounded-xl shadow-lg">
      <h4 className="text-lg font-semibold mb-4 text-white">Recent Orders</h4>

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
            {orders.map((o) => (
              <tr
                key={o._id}
                onClick={() => navigate(`/order/${o._id}`)}
                className="cursor-pointer border-b border-slate-700 hover:bg-slate-700/40"
              >
                <td className="px-4 py-3">{o._id}</td>
                <td className="px-4 py-3">{o.items?.[0]?.name || "Item"}</td>
                <td className="px-4 py-3">{o.customerName || "Guest"}</td>
                <td className="px-4 py-3">₹ {o.finalAmount || 0}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded text-xs text-white ${
                      statusColor[o.paymentStatus?.toLowerCase()] || "bg-yellow-500"
                    }`}
                  >
                    {o.paymentStatus || "Pending"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded text-xs text-white ${
                      statusColor[o.orderStatus?.toLowerCase()] || "bg-yellow-500"
                    }`}
                  >
                    {o.orderStatus || "Pending"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 text-white">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          className="px-4 py-2 bg-slate-700 rounded disabled:opacity-40"
        >
          ◀ Previous
        </button>

        <span className="text-sm">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          className="px-4 py-2 bg-slate-700 rounded disabled:opacity-40"
        >
          Next ▶
        </button>
      </div>
    </div>
  );
};

export default Order;
