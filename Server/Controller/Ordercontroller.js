const Cart = require("../Models/cart");
const User = require("../Models/User");
const Order = require("../Models/order");
const razorpay = require("../config/razorpay");
const crypto = require("crypto");
const mongoose = require("mongoose");

const calculateOrderNumber = () => {
  const date = Date.now();
  const randomNumber = Math.floor(Math.random() * 10000000);
  return `ORDER-${date * randomNumber}`;
};

const clearCart = async (userId) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) return;

  cart.items = [];
  cart.totalCartPrice = 0;
  cart.discount = 0;
  cart.appliedCoupon = null;
  await cart.save();
};

exports.createOrder = async (req, res, next) => {
  try {
    const { coupanCode, tableNumber, notes, paymentMethod } = req.body || {};
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User not found" });
    }

    if (!paymentMethod || !["cash", "razorpay"].includes(paymentMethod)) {
      return res.status(400).json({ message: "Valid paymentMethod is required" });
    }

    const cart = await Cart.findOne({ userId }).populate("items.menuItemId");
    if (!cart || !cart.items.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const orderItems = [];
    let subTotal = 0;

    cart.items.forEach((item) => {
      const total = Number(item.quantity) * Number(item.menuItemId.price);
      subTotal += total;

      orderItems.push({
        menuItemId: item.menuItemId._id,
        name: item.menuItemId.name,
        price: item.menuItemId.price,
        quantity: item.quantity,
        subTotal: total,
      });
    });

    const discountAmount = Number(cart.discount || 0);
    const finalAmount = Math.max(subTotal - discountAmount, 0);
    const orderNumber = calculateOrderNumber();

    const dataOfOrder = {
      orderNumber,
      userId,
      items: orderItems,
      subTotal,
      discountAmount,
      finalAmount,
      coupanCode: coupanCode || cart.appliedCoupon || null,
      tableNumber: tableNumber || cart.tableNumber || null,
      customerEmail: user.email || null,
      customerName: user.name || null,
      customerPhone: user.phone || null,
      notes,
      paymentMethod,
    };

    if (paymentMethod === "cash") {
      const savedOrder = await Order.create({
        ...dataOfOrder,
        paymentStatus: "confirmed",
      });

      await clearCart(userId);
      user.totalOrders = (user.totalOrders || 0) + 1;
      await user.save();

      return res.status(201).json({
        success: true,
        message: "Order placed Successfully",
        data: savedOrder,
      });
    }

    if (!razorpay) {
      return res.status(503).json({
        success: false,
        message: "Razorpay is not configured. Add RAZORPAY_API_KEY and RAZORPAY_API_SECRET.",
      });
    }

    const razorPayOrder = await razorpay.orders.create({
      amount: finalAmount * 100,
      currency: "INR",
      receipt: orderNumber,
      notes: {
        customerEmail: user.email || "",
        customerPhone: user.phone || "",
        customerName: user.name || "",
      },
    });

    const savedOrder = await Order.create({
      ...dataOfOrder,
      razorPayOrderId: razorPayOrder.id,
    });

    return res.status(200).json({
      success: true,
      order: savedOrder,
      razorPayOrder,
      key: process.env.RAZORPAY_API_KEY,
    });
  } catch (error) {
    next(error);
  }
};

exports.verifypayment = async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(503).json({
        success: false,
        message: "Razorpay is not configured. Add RAZORPAY_API_KEY and RAZORPAY_API_SECRET.",
      });
    }

    const { paymentId, signature, razorPayOrderId } = req.body;
    const savedOrder = await Order.findOne({ razorPayOrderId });

    if (!savedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(`${razorPayOrderId}|${paymentId}`)
      .digest("hex");

    if (generatedSignature !== signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed!",
      });
    }

    const payment = await razorpay.payments.fetch(paymentId);

    if (payment.status === "captured" || payment.status === "authorized") {
      savedOrder.paymentStatus = "confirmed";
      savedOrder.razorPaySignature = signature;
      savedOrder.razorPayPaymentId = paymentId;
      await savedOrder.save();

      await clearCart(savedOrder.userId);

      const user = await User.findById(savedOrder.userId);
      if (user) {
        user.totalOrders = (user.totalOrders || 0) + 1;
        await user.save();
      }
    } else if (payment.status === "failed") {
      savedOrder.paymentStatus = "failed";
      await savedOrder.save();
    }

    return res.status(200).json({
      success: true,
      message: "Payment Verified",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.getorder = async (req, res) => {
  try {
    const userId = req.query.userId || null;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 100;
    const skip = (page - 1) * limit;

    const filter = {};

    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid userId" });
      }
      filter.userId = new mongoose.Types.ObjectId(userId);
    }

    const totalOrders = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      orders,
      totalOrders,
      totalPages: Math.ceil(totalOrders / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Get order error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.monthlysales = async (req, res) => {
  try {
    const sales = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalSales: { $sum: "$finalAmount" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res.json({
      success: true,
      sales,
    });
  } catch (error) {
    console.error("Monthly sales error:", error);
    res.status(500).json({ message: error.message });
  }
};
