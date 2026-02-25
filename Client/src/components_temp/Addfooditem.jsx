import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


const AddFoodItem = ({ type }) => {
  const [formdata, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    isAvailable: "IN-STOCK",
    image: null
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formdata.image) return toast.error("Upload image");

    const Data = new FormData();
    Object.entries(formdata).forEach(([key, value]) => Data.append(key, value));

    const apiURL = type === "menu"
      ? "http://localhost:3000/api/v1/menu"
      : "http://localhost:3000/api/v1/products";

    try {
      const res = await fetch(apiURL, { method: "POST", body: Data });
      const data = await res.json();
      if (data.success) {
        toast.success("Item added successfully");
        navigate("/admindash");
      } else {
        toast.error(data.message || "Error adding item");
      }
    } catch (err) {
      toast.error("Server error: " + err.message);
    }
  };

  return (
    <div className="add-food-container">
      <form className="add-food-form" onSubmit={handleSubmit}>
        <h2 className="form-title">{type === "menu" ? "Add Menu Item" : "Add Product"}</h2>

        <input type="text" placeholder="Name"
          value={formdata.name}
          onChange={e => setFormData({ ...formdata, name: e.target.value })}
          className="form-input"
        />
        <input type="text" placeholder="Description"
          value={formdata.description}
          onChange={e => setFormData({ ...formdata, description: e.target.value })}
          className="form-input"
        />
        <input type="text" placeholder="Category"
          value={formdata.category}
          onChange={e => setFormData({ ...formdata, category: e.target.value })}
          className="form-input"
        />
        <input type="number" placeholder="Price"
          value={formdata.price}
          onChange={e => setFormData({ ...formdata, price: e.target.value })}
          className="form-input"
        />
        <select
          value={formdata.isAvailable}
          onChange={e => setFormData({ ...formdata, isAvailable: e.target.value })}
          className="form-input"
        >
          <option value="IN-STOCK">In Stock</option>
          <option value="OUT-STOCK">Out of Stock</option>
        </select>
        <input type="file"
          onChange={e => setFormData({ ...formdata, image: e.target.files[0] })}
          className="form-input file-input"
        />
        <button type="submit" className="submit-btn">Add Item</button>
      </form>
    </div>
  );
};

export default AddFoodItem;
