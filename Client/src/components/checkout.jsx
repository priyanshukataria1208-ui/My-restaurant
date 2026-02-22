import React, { useEffect, useState } from "react";
import api from "../lib/api";
import { useToast } from "./context/ToastProvider";

function Checkout() {
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("idle");
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [totalAmount, setTotalAmount] = useState(0);

  // 🔹 Demo / temp data (baad me form se lo)
  const tableNumber = 3;
  const CustomerName = "Priyanshu";
  const CustomerEmail = "priyanshu@gmail.com";
  const CustomerPhone = "9999999999";

  // 🔹 Load Razorpay + Fetch cart total
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    fetchCartTotal();
  }, []);

  // 🔹 Cart se final amount (discount ke baad)
  const fetchCartTotal = async () => {
    try {
      const res = await api.get("/v1/");
      const cart = res.data.cart;

      const finalAmount =
        cart.totalCartPrice - (cart.discount || 0);

      setTotalAmount(finalAmount);
    } catch (err) {
      console.error(err);
      toast.error("Unable to fetch cart total");
    }
  };

  const payload = {
    tableNumber,
    CustomerName,
    CustomerEmail,
    CustomerPhone,
    paymentMethod,
  };

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);

      // 🟡 CASH ON DELIVERY
      if (paymentMethod === "cash") {
        await api.post("/v1/order", payload);

        setStep("success");
        setLoading(false);
        toast.success("🧾 Order placed (Cash on Delivery)");
        return;
      }

      // 🟢 ONLINE PAYMENT
      setStep("creating");

      const result = await api.post("/v1/order", payload);
      const { order, razorPayOrder, key } = result.data;

      if (!window.Razorpay) {
        toast.error("Payment SDK not loaded");
        setLoading(false);
        return;
      }

      setStep("paying");

      new window.Razorpay({
        key,
        order_id: razorPayOrder.id,
        amount: razorPayOrder.amount,
        currency: razorPayOrder.currency,
        name: "SavoryBites",

        handler: async (res) => {
          await api.post("/v1/verify/payment", {
            paymentId: res.razorpay_payment_id,
            razorPayOrderId: res.razorpay_order_id,
            signature: res.razorpay_signature,
          });

          setStep("success");
          setLoading(false);
          toast.success("🎉 Order Confirmed");
        },

        modal: {
          ondismiss: () => {
            toast.info("Payment Cancelled");
            setLoading(false);
            setStep("idle");
          },
        },

        prefill: {
          name: order.CustomerName,
          email: order.CustomerEmail,
          contact: order.CustomerPhone,
        },
      }).open();
    } catch (err) {
      console.error(err);
      toast.error("Order Failed");
      setLoading(false);
      setStep("idle");
    }
  };

  return (
    <div className="checkout-bg">
      <div className={`checkout-glass ${step === "success" ? "success" : ""}`}>
        {step !== "success" ? (
          <>
            <h2>⚡ Smart Checkout</h2>

            {/* 🔹 PAYMENT OPTIONS */}
            <div className="payment-options">
              <label style={{color:"white"}}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "razorpay"}
                  onChange={() => setPaymentMethod("razorpay")}
                />
                Online Payment (Razorpay)
              </label>

              <label style={{color:"white"}}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "cash"}
                  onChange={() => setPaymentMethod("cash")}
                />
                Cash on Delivery
              </label>
            </div>

            {/* 🔹 ORDER INFO */}
            <div className="order-info">
              <p><b>Name:</b> {CustomerName}</p>
              <p><b>Table:</b> #{tableNumber}</p>
              <p><b>Payment:</b> {paymentMethod.toUpperCase()}</p>

              <hr />

              <p className="text-lg font-bold">
                Total Amount: ₹ {totalAmount}
              </p>
            </div>

            <button
              disabled={loading}
              onClick={handlePlaceOrder}
              className={`pay-btn ${loading ? "loading pulse" : "pulse"}`}
            >
              {loading
                ? "Processing..."
                : paymentMethod === "cod"
                ? `Place Order ₹${totalAmount}`
                : `Pay ₹${totalAmount}`}
            </button>
          </>
        ) : (
          <div className="success-zone">
            <div className="checkmark">✓</div>
            <h3>Order Placed</h3>
            <p>Food is on the way 🍔</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Checkout;
