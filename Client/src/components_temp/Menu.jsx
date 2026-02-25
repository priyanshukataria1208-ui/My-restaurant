import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import SkeletonCard from "./Skeltoncard"; // 🔥 interceptors wala
import api from "../lib/api";
const Menu = () => {
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");

  // ================= FETCH MENU =================
  const fetchFoods = async () => {
    try {
      setLoading(true);
      const res = await api.get("/v1/menu"); // 🔥 interceptors handle JWT
      setFoods(res.data.data || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load menu items"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    window.menuFoods=foods
  },[foods])
  useEffect(() => {
    fetchFoods();
  }, []);

  // ================= ADD TO CART =================
  const addToCart = async (menuItemId) => {
    if (!userId) {
      toast.error("Please login first!");
      return;
    }

    try {
      setLoadingId(menuItemId);

      await api.post("/v1/addcart", {
        menuItemId,
        userId,
        quantity: 1,
      });

      toast.success("Item added to cart 🛒");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add item"
      );
    } finally {
      setLoadingId(null);
    }
  };

  // ================= SEARCH =================
  const filterProducts = foods.filter((item) =>
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  // ================= UI =================
  return (
    <div className="menu-page">
      <h1 className="menu-title">Our Menu</h1>

      <div className="search-box">
        <input
          type="search"
          placeholder="Search food..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="menu-grid">
        {loading &&
          Array(6)
            .fill(0)
            .map((_, i) => <SkeletonCard key={i} />)}

        {!loading &&
          filterProducts.map((item) => (
            <div className="menu-card" key={item._id}>
              <div className="menu-img-wrapper">
                <img
                  src={item.image}
                  alt={item.name}
                  className="food-img"
                  onLoad={(e) => e.target.classList.add("loaded")}
                />

                {item.offer && (
                  <span className="offer-badge">
                    {item.offer}% OFF
                  </span>
                )}
              </div>

              <div className="menu-info">
                <h3>{item.name}</h3>
                <p className="category">{item.category}</p>
                <p className="price">₹{item.price}</p>

                <button
                  className="add-btn"
                  disabled={loadingId === item._id}
                  onClick={() => addToCart(item._id)}
                >
                  {loadingId === item._id ? "Adding..." : "Add to Cart"}
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Menu;
