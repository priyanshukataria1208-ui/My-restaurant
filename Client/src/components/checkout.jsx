import React, { useEffect, useState } from 'react';
import api from '../lib/api';
import { useToast } from './context/ToastProvider';


function Checkout() {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('idle');

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    document.body.appendChild(script);
  }, []);

  const payload = {
    coupanCode,
    tableNumber,
    CustomerName,
    CustomerEmail,
    CustomerPhone,
    paymentMethod,
  };

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      setStep('creating');

      const result = await api.post('v1/order', payload);
      const { order, razorPayOrder, key } = result.data;

      setStep('paying');

      new window.Razorpay({
        key,
        order_id: razorPayOrder.id,
        amount: razorPayOrder.amount,
        currency: razorPayOrder.currency,
        name: "SavoryBites",

        handler: async (res) => {
          await api.post('v1/verify/payment', {
            paymentId: res.razorpay_payment_id,
            razorPayOrderId: res.razorpay_order_id,
            signature: res.razorpay_signature,
          });

          setStep('success');
          setLoading(false);
          toast.success("🎉 Order Confirmed");
        },

        modal: {
          ondismiss: () => {
            toast.info("Payment Cancelled");
            setLoading(false);
            setStep('idle');
          },
        },

        prefill: {
          name: order.CustomerName,
          email: order.CustomerEmail,
          contact: order.CustomerPhone,
        },
      }).open();

    } catch {
      toast.error("Payment Failed");
      setLoading(false);
      setStep('idle');
    }
  };

  return (
    <div className="checkout-bg">
      <div className={`checkout-glass ${step === 'success' ? 'success' : ''}`}>

        {step !== 'success' ? (
          <>
            <h2>⚡ Smart Checkout</h2>

            <div className="progress-bar">
              <span className={step !== 'idle' ? 'fill' : ''}></span>
            </div>

            <div className="order-info">
              <p><b>Name</b> Priyanshu</p>
              <p><b>Table</b> #3</p>
              <p><b>Payment</b> Razorpay</p>
            </div>

            <button
              disabled={loading}
              onClick={handlePlaceOrder}
              className={`pay-btn ${loading ? 'loading pulse' : 'pulse'}`}
            >
              {loading ? 'Processing...' : 'Pay Securely'}
            </button>
          </>
        ) : (
          <div className="success-zone">
            <div className="checkmark">✓</div>
            <h3>Order Placed</h3>
            <p>Food is on the way 🍔</p>
            <div className="confetti"></div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Checkout;
