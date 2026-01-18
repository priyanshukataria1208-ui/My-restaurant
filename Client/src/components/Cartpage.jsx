import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

const Cartpage = () => {
  const { userId, accessToken } = useContext(AuthContext);
  const [cart, setCart] = useState(null);
  const [loadingItem, setLoadingItem] = useState(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    if (userId) {
      fetchCart();
      fetchCoupons();
    }
  }, [userId]);

  const fetchCart = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/v1/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.data?.cart) {
        setCart(res.data.cart);
        setAppliedCoupon(res.data.cart.appliedCoupon || null);
        setDiscount(res.data.cart.discount || 0);
      }

    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  const fetchCoupons = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/v1/coupan", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.data?.CoupansAfterCalculation) setAvailableCoupons(res.data.CoupansAfterCalculation);
      const activecoupans=res.data.CoupansAfterCalculation.filter(c=>c.isActive)
      setAvailableCoupons(activecoupans)
    } catch (err) {
      console.log(err.response?.data || err.message);
      setAvailableCoupons([]);
    }
  };

  const increment = async (menuItemId) => {
    setLoadingItem(menuItemId);
    await axios.post(
      "http://localhost:3000/api/v1/increment",
      { menuItemId },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    await fetchCart();
    setLoadingItem(null);
  };

  const decrement = async (menuItemId) => {
    setLoadingItem(menuItemId);
    await axios.post(
      "http://localhost:3000/api/v1/decrement",
      { menuItemId },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    await fetchCart();
    setLoadingItem(null);
  };

  const removeItem = async (menuItemId) => {
    setLoadingItem(menuItemId);
    await axios.post(
      "http://localhost:3000/api/v1/remove",
      { menuItemId },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    await fetchCart();
    setLoadingItem(null);
  };

  // APPLY COUPON FRONTEND
  const applyCoupon = (coupon) => {
    if (!cart) return;
    if (cart.totalCartPrice < coupon.minOrderAmount) {
      toast.error(`Add ₹${coupon.minOrderAmount - cart.totalCartPrice} more to use this coupon`);
      return;
    } 
try {
  
} catch (error) {
  
}
  };

  if (!cart || !cart.items.length)
    return <h2 className="text-center mt-5">🛒 Your cart is empty!</h2>;

  const totalAmount = cart.totalCartPrice;
  const finalAmount = totalAmount - discount;

return (
  <div className="min-h-screen bg-slate-900 text-white p-4 md:p-8">
    <h2 className="text-2xl font-bold mb-6">🛒 Your Cart</h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

      {/* LEFT - CART ITEMS */}
      <div className="md:col-span-2 bg-slate-800 rounded-xl p-5 shadow-lg">
        {cart.items.map((item) => (
          <div
            key={item.menuItemId._id}
            className="flex flex-col md:flex-row gap-4 border-b border-slate-700 pb-4 mb-4"
          >
            <img
              src={item.menuItemId.image || "/default-food.png"}
              alt={item.menuItemId.name}
              className="w-full md:w-28 h-28 object-cover rounded-lg"
            />

            <div className="flex-1">
              <h4 className="font-semibold text-lg">
                {item.menuItemId.name}
              </h4>
              <p className="text-sm text-slate-400">
                {item.menuItemId.description || "Delicious item"}
              </p>

              <div className="flex items-center gap-3 mt-3">
                <button
                  onClick={() => decrement(item.menuItemId._id)}
                  disabled={item.quantity <= 1 || loadingItem === item.menuItemId._id}
                  className="px-3 py-1 bg-slate-700 rounded disabled:opacity-40"
                >
                  −
                </button>

                <span>{item.quantity}</span>

                <button
                  onClick={() => increment(item.menuItemId._id)}
                  disabled={loadingItem === item.menuItemId._id}
                  className="px-3 py-1 bg-slate-700 rounded disabled:opacity-40"
                >
                  +
                </button>

                <button
                  onClick={() => removeItem(item.menuItemId._id)}
                  className="ml-auto text-red-400 hover:text-red-500"
                >
                  Remove
                </button>
              </div>
            </div>

            <div className="font-semibold text-lg">
              ₹ {item.menuItemId.price * item.quantity}
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT - SUMMARY */}
      <div className="bg-slate-800 rounded-xl p-5 shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Summary</h3>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Products</span>
            <span>₹ {totalAmount}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-green-400">
              <span>Discount ({appliedCoupon})</span>
              <span>- ₹ {discount}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span>Shipping</span>
            <span>Free</span>
          </div>

          <hr className="border-slate-600 my-2" />

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>₹ {finalAmount}</span>
          </div>
        </div>

        {/* COUPONS */}
       {!appliedCoupon&&(
        <>
         <h4 className="mt-6 mb-2 font-semibold">Coupons</h4>

        <div className="space-y-3" >
          {availableCoupons.map((c) => {
            const eligible = totalAmount >= c.minOrderAmount;
            return (
              <div
                key={c.code}
                className={`p-3 mt-4 rounded-lg ${
                  eligible ? "bg-green-700" : "bg-slate-700"
                }`}
              >
                <div className="font-semibold">{c.code}</div>
                <p className="text-xs text-slate-200">{c.description}</p>

                {eligible ? (
                  <button
                    onClick={() => applyCoupon(c)}
                    disabled={appliedCoupon === c.code}
                    className="mt-2 px-3 py-1 text-sm bg-black rounded disabled:opacity-50"
                  >
                    {appliedCoupon === c.code ? "Applied" : "Apply"}
                  </button>
                ) : (
                  <p className="text-xs mt-2 text-yellow-400">
                    Add ₹{c.minOrderAmount - totalAmount} more
                  </p>
                )}
              </div>
            );
          })}
        </div></>
       )}

        <Link
          to="/checkout"
          className="block text-center mt-10 bg-indigo-600 hover:bg-indigo-700 py-3 rounded-lg font-semibold" style={{color:"white"}}
        >
          Go to Checkout →
        </Link>
      </div>
    </div>
  </div>
);

};

export default Cartpage;
