import React, { useEffect, useState } from "react";
import api from "../lib/api";

const AdminCouponList = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const fetchCoupons = async () => {
        try {
            const res = await api.get("/v1/admin/coupons");
            if (res.data.success) setCoupons(res.data.coupons);
        } catch (err) {
            console.error(err);
            setMessage("Error fetching coupons");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);
    const toggleStatus = async (id) => {
        console.log("Toggling coupon ID:", id);
        try {
            const res = await api.patch(`/v1/admin/coupons/${id}/toggle`);
            console.log(res.data);  // check backend response
            if (res.data.success) {
                setCoupons((prev) =>
                    prev.map((c) => (c._id === id ? res.data.coupon : c))
                );
                setMessage(res.data.message);
            }
        } catch (err) {
            console.error("Toggle error:", err.response ? err.response.data : err);
            setMessage("Error updating status");
        }
    };


    if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading...</p>;

    return (
        <div style={pageStyle}>
            <h1 style={headingStyle}>Total Coupons: {coupons.length}</h1>
            {message && <p style={messageStyle}>{message}</p>}

            <div style={cardsContainer}>
                {coupons.map((c) => (
                    <div key={c._id} style={cardStyle}>
                        <div style={rowStyle}>
                            <span style={label}>Code:</span> <span style={value}>{c.code}</span>
                        </div>
                        <div style={rowStyle}>
                            <span style={label}>Type:</span> <span style={value}>{c.discountType}</span>
                        </div>
                        <div style={rowStyle}>
                            <span style={label}>Discount:</span> <span style={value}>{c.discountValue}{c.discountType === 'percentage' ? '%' : '₹'}</span>
                        </div>
                        <div style={rowStyle}>
                            <span style={label}>Min Order:</span> <span style={value}>{c.minOrderAmount || 0}₹</span>
                        </div>
                        <div style={rowStyle}>
                            <span style={label}>Max Discount:</span> <span style={value}>{c.maxDiscount || '-'}₹</span>
                        </div>
                        <div style={rowStyle}>
                            <span style={label}>Usage Limit:</span> <span style={value}>{c.usageLimit || '-'}</span>
                        </div>
                        <div style={rowStyle}>
                            <span style={label}>Valid:</span> <span style={value}>{c.validFrom ? new Date(c.validFrom).toLocaleDateString() : '-'} → {c.validTo ? new Date(c.validTo).toLocaleDateString() : '-'}</span>
                        </div>
                        <div style={rowStyle}>
                            <span style={label}>Status:</span>
                            <span style={{
                                ...statusBadge,
                                backgroundColor: c.isActive ? '#4ade80' : '#f87171'
                            }}>
                                {c.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                        <button
                            onClick={() => toggleStatus(c._id)}
                            style={{
                                ...toggleBtn,
                                background: c.isActive
                                    ? 'linear-gradient(90deg, #f87171, #f43f5e)'
                                    : 'linear-gradient(90deg, #4ade80, #16a34a)'
                            }}
                        >
                            {c.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminCouponList;

// ===================== STYLES =====================

const pageStyle = {
    padding: "40px",
    fontFamily: "'Arial', sans-serif",
    background: "linear-gradient(135deg, #032b2f, #02122d)",
    minHeight: "100vh",
};

const headingStyle = {
    fontSize: "2.5rem",
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "30px",
    textShadow: "2px 2px 6px rgba(0,0,0,0.3)",
};

const messageStyle = {
    textAlign: "center",
    marginBottom: "20px",
    fontWeight: "bold",
    color: "#333",
};

const cardsContainer = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
};

const cardStyle = {
    background: "#fff",
    padding: "25px",
    borderRadius: "20px",
    boxShadow: "0 15px 30px rgba(0,0,0,0.2)",
    transition: "transform 0.3s, box-shadow 0.3s",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
};

const rowStyle = {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "1rem",
};

const label = { fontWeight: "bold", color: "#333" };
const value = { color: "#555" };

const statusBadge = {
    color: "#fff",
    fontWeight: "bold",
    padding: "3px 10px",
    borderRadius: "12px",
    fontSize: "0.9rem",
};

const toggleBtn = {
    marginTop: "10px",
    padding: "10px",
    borderRadius: "15px",
    border: "none",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "transform 0.3s",
};

