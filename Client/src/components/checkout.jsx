import React, { useEffect, useState } from "react";
import api from "../lib/api";
import { useToast } from "./context/ToastProvider";

function Checkout() {
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("idle");
  const [paymentMethod, setPaymentMethod] = useState("razorpay");

  const [cart, setCart] = useState(null);
  const [user, setUser] = useState(null);


  const [totalAmount, setTotalAmount] = useState(0);


  console.log(cart)

  useEffect(() => {
    loadRazorpay();
    fetchCart();
  }, []);

  // 🔹 Razorpay SDK
  const loadRazorpay = () => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout";
    script.async = true;
    document.body.appendChild(script);
  };

  // 🛒 CART + USER
  const fetchCart = async () => {
    try {
      const res = await api.get("/v1/");

      setCart(res.data.cart);
      setUser(res.data.user);
      const finalAmount =
        (res.data.cart?.totalCartPrice || 0) - (res.data.cart?.discount || 0);
      setTotalAmount(finalAmount);
    } catch (err) {
      toast.error("Failed to load cart");
    }
  };

  // ✅ PAYLOAD
  const payload = {
    tableNumber: cart?.tableNumber,
    paymentMethod,
  };

  const handlePlaceOrder = async () => {
    if (!cart || !user) {
      toast.error("Missing cart or user data");
      return;
    }

    try {
      setLoading(true);

      // 🟡 CASH
      if (paymentMethod === "cash") {
        await api.post("/v1/order", payload);
        setStep("success");
        toast.success("Order placed (Cash)");
        setLoading(false);
        return;
      }

      // 🟢 ONLINE
      const res = await api.post("/v1/order", payload);
      const { razorPayOrder, key } = res.data;

      new window.Razorpay({
        key,
        order_id: razorPayOrder.id,
        amount: razorPayOrder.amount,
        currency: razorPayOrder.currency,
        name: "SavoryBites",

        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone,
        },

        handler: async (response) => {
          await api.post("/v1/verify/payment", {
            paymentId: response.razorpay_payment_id,
            razorPayOrderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
          });

          setStep("success");
          setLoading(false);
          toast.success("Payment Successful");
        },

        modal: {
          ondismiss: () => {
            toast.info("Payment cancelled");
            setLoading(false);
          },
        },
      }).open();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Order failed");
      setLoading(false);
    }
  };

  return (
    <div className="checkout-bg">
      <div className="checkout-glass">
        {step !== "success" ? (
          <>
            <h2>🧾 Checkout</h2>

            {/* 👤 USER */}
            <div className="order-info">
              <p><b>Name:</b> {user?.name}</p>
              <p><b>Table No:</b> #{cart?.tableNumber || "N/A"}</p>
            </div>

            <hr />

            {/* 🛒 ITEMS */}
            <div className="cart-items" style={{ color: "white" }}>
              {cart?.items?.map((item) => (
                <p key={item._id}>
                  {item.menuItemId?.name} × {item.quantity}
                </p>
              ))}
            </div>

            <hr />

            <p className="total" style={{ color: "white" }}>Total: ₹ {totalAmount}</p>

            {/* 💳 PAYMENT */}
            <div className="payment-options" >
              <label style={{ color: "white" }}>
                <input
                  type="radio"
                  checked={paymentMethod === "razorpay"}
                  onChange={() => setPaymentMethod("razorpay")}
                />
                Online Payment
              </label>

              <label style={{ color: "white" ,marginLeft:"20px"}}>
                <input
                  type="radio"
                  checked={paymentMethod === "cash"}
                  onChange={() => setPaymentMethod("cash")}
                />
                Cash Payment
              </label>
            </div>

            <button
              disabled={loading}
              onClick={handlePlaceOrder}
              className="pay-btn"
            >
              {loading ? "Processing..." : `Pay ₹${totalAmount}`}
            </button>
          </>
        ) : (
          <div className="success-zone">
            <h3>✅ Order Confirmed</h3>
            <p>Food is being prepared 🍽️</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Checkout;
