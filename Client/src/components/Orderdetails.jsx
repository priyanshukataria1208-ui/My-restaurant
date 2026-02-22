import React, { useEffect, useState } from "react";
import api from "../lib/api";
import { useNavigate, useParams } from "react-router-dom";

const OrderDetails = () => {
  const { id } = useParams(); // orderId
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/v1/order/${id}`);
        setOrder(res.data.order);
      } catch (err) {
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <p className="p-4">Loading order...</p>;
  if (!order) return <p className="p-4">Order not found.</p>;

  return (
    <div className="order-dashboard">
      <div className="box header-box">
        <h2>Order Details</h2>
        <button onClick={() => navigate(-1)}>← Back</button>
      </div>

      {/* User Details */}
      <div className="box user-box">
        <h3>User Info</h3>
        <p><strong>Name:</strong> {order.customerName}</p>
        <p><strong>Email:</strong> {order.customerEmail}</p>
        <p><strong>Phone:</strong> {order.customerPhone}</p>
      </div>

      {/* Order Details */}
      <div className="box order-box">
        <h3>Order #{order.orderNumber}</h3>
        <p><strong>Table:</strong> {order.tableNumber || "N/A"}</p>
        <p>
          <strong>Payment Status:</strong> {order.paymentStatus}
        </p>
        <p>
          <strong>Order Status:</strong> {order.orderStatus}
        </p>

        <div className="items-box">
          {order.items.map((item, idx) => (
            <div key={idx} className="item-card">
              <p><strong>{item.name}</strong></p>
              <p>Qty: {item.quantity}</p>
              <p>Price: ₹ {item.price}</p>
              <p>Subtotal: ₹ {item.subTotal}</p>
            </div>
          ))}
        </div>

        <p className="total-amount">Total: ₹ {order.finalAmount}</p>
      </div>
    </div>
  );
};

export default OrderDetails;
