import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AdminFoodProducts = ({ type }) => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  // Fetch items
  const fetchItems = () => {
    const apiURL = type === "menu"
      ? "http://localhost:3000/api/v1/menu"
      : "http://localhost:3000/api/v1/products";

    fetch(apiURL)
      .then(res => res.json())
      .then(data => setItems(data.products || data.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchItems();
  }, [type]);

  // Delete item
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    const apiURL = type === "menu"
      ? `http://localhost:3000/api/v1/menu/${id}`
      : `http://localhost:3000/api/v1/products/${id}`;

    try {
      const res = await fetch(apiURL, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Item deleted successfully");
        fetchItems(); // refresh list
      } else {
        toast.error(data.message || "Failed to delete");
      }
    } catch (err) {
      toast.error("Server error: " + err.message);
    }
  };

  // Update item → navigate to AddFoodItem form with type & id
  const handleUpdate = (id) => {
    navigate(`/add-food-item/${type}/${id}`);
  };

  return (
    <div className="admin-page">
      <h1 className="title">{type === "menu" ? "Menu Items" : "Products"}</h1>

      <div className="product-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Description</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th> {/* New */}
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item._id} className="table-row">
                <td>
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="product-img" />
                  ) : (
                    <span>-</span>
                  )}
                </td>
                <td>{item.name || "-"}</td>
                <td>{item.category || "-"}</td>
                <td >{item.description || "-"}</td>
                <td>₹{item.price || 0}</td>
                <td>
                  <span className={`status-tag ${item.isAvailable ? "available" : "unavailable"}`}>
                    {item.isAvailable ? "In Stock" : "Out of Stock"}
                  </span>
                </td>
                <td>
                
                  <button
                    className="action-btn btn-danger"
                    onClick={() => handleDelete(item._id)}
                    style={{ marginLeft: "10px" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminFoodProducts;
