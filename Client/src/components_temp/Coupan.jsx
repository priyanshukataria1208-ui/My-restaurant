import React, { useState } from "react";

import api from "../lib/api";

const AdminAddCoupon = () => {
  const [form, setForm] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    minOrder: "",
    maxDiscount: "",
    usageLimit: "",
    validFrom: "",
    validTo: "",
    description: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.code || !form.discountValue || !form.discountType) {
      setMessage("Coupon Code, Discount and Discount Type are required.");
      return;
    }

    try {
      const res = await api.post("/v1/coupan", form);
      if (res.data.success) {
        setMessage("🎉 Coupon added successfully!");
        setForm({
          code: "",
          discountType: "percentage",
          discountValue: "",
          minOrder: "",
          maxDiscount: "",
          usageLimit: "",
          validFrom: "",
          validTo: "",
          description: "",
        });
      } else {
        setMessage("❌ Error adding coupon");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Server error");
    }
  };

  return (
    <div className="coupon-page">
      {/* Stylish top heading */}
      <h1 className="coupon-page-heading">✨ Add a New Coupon ✨</h1>

      <div className="coupon-card">
        <form className="coupon-form" onSubmit={handleSubmit}>
          {/* Coupon fields */}
          <div className="form-group">
            <label>Coupon Code</label>
            <input
              type="text"
              name="code"
              placeholder="NEWYEAR50"
              value={form.code}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Discount Type</label>
            <select
              name="discountType"
              value={form.discountType}
              onChange={handleChange}
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
            </select>
          </div>

          <div className="form-group">
            <label>Discount Value</label>
            <input
              type="number"
              name="discountValue"
              placeholder="50"
              value={form.discountValue}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Minimum Order Amount</label>
            <input
              type="number"
              name="minOrder"
              placeholder="Optional"
              value={form.minOrder}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Maximum Discount</label>
            <input
              type="number"
              name="maxDiscount"
              placeholder="Optional"
              value={form.maxDiscount}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Usage Limit</label>
            <input
              type="number"
              name="usageLimit"
              placeholder="Optional"
              value={form.usageLimit}
              onChange={handleChange}
            />
          </div>

          <div className="form-group date-group">
            <div>
              <label>Valid From</label>
              <input
                type="date"
                name="validFrom"
                value={form.validFrom}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Valid To</label>
              <input
                type="date"
                name="validTo"
                value={form.validTo}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label>Description</label>
            <textarea
              name="description"
              placeholder="Optional description"
              value={form.description}
              onChange={handleChange}
            ></textarea>
          </div>

          <button type="submit" className="submit-btn">
            Add Coupon
          </button>

          {message && <p className="message">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default AdminAddCoupon;
