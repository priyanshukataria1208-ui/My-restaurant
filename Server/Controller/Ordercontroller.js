
const Cart = require("../Models/cart");
const Coupan = require("../Models/coupen");
const Table = require("../Models/table");
const User = require("../Models/User");
const Order = require("../Models/order");
const razorpay = require("../config/razorpay");
const order = require("../Models/order");
const crypto = require("crypto")
const mongoose = require("mongoose")

const calculateOrderNumber = () => {
    const date = Date.now();
    const randomNumber = Math.floor(Math.random() * 10000000);
    return `ORDER-${date * randomNumber}`;
};

exports.createOrder = async (req, res, next) => {
    try {
        const {
            coupanCode,
            tableNumber, // optional now 
            notes,
            
            paymentMethod,
        } = req.body || {};

        // ✅ Optional 
     

        // ✅ User ID
        const userId = req.user?.id;

        // ✅ Fetch cart
        const cartItems = await Cart.findOne({ userId }).populate("items.menuItemId");
        if (!cartItems || !cartItems.items.length) {
            return res.status(400).json({ message: "Cart is empty" });
        }

           const tableNO=tableNumber||cartItems.tableNumber
      
        if (!tableNO) {
            const error = new Error('No table Found');
            error.status = 404;
            throw error;
        }

        // ✅ Prepare order items & subtotal
        const orderItems = [];
        let subTotal = 0;

        cartItems.items.forEach((item) => {
            const total = item.quantity * item.menuItemId.price;
            subTotal += total;

            orderItems.push({
                menuItemId: item.menuItemId._id,
                name: item.menuItemId.name,
                price: item.menuItemId.price,
                quantity: item.quantity,
                subTotal: total,
            });
        });
        let CoupansAfterCalculation = null;

        let totalCartPrice = subTotal;
        if (CoupansAfterCalculation?.isAvailable) {
            totalCartPrice = CoupansAfterCalculation.finalAmount;
        }

        // ✅ Fetch coupon (safe trim + case-insensitive)
        let coupan = null;


        if (coupanCode) {
            coupan = await Coupan.findOne({
                code: new RegExp(`^${coupanCode.trim()}$`, "i"),
                isActive: true,
            });

            if (coupan) {
                const now = new Date();
                const validFrom = coupan.validFrom ? new Date(coupan.validFrom) : new Date("1970-01-01");
                const validTo = coupan.validTo ? new Date(coupan.validTo) : new Date("9999-12-31");

                const minOrderMet = totalCartPrice >= (coupan.minOrderAmount || 0);
                const valid = now >= validFrom && now <= validTo;
                const firstOrderValid = true; // TODO: implement first order logic if needed

                const isAvailable = coupan.isActive && minOrderMet && valid && firstOrderValid;

                let discountAmount = 0;
                if (coupan.discountType === "fixedAmount") {
                    discountAmount = coupan.discountValue;
                }
                if (coupan.discountType === "percentage") {
                    discountAmount = (totalCartPrice * coupan.discountValue) / 100;
                    if (coupan.maxDiscount && discountAmount > coupan.maxDiscount) {
                        discountAmount = coupan.maxDiscount;
                    }
                }

                CoupansAfterCalculation = {
                    ...coupan._doc,
                    finalAmount: totalCartPrice - discountAmount,
                    discountAmount,
                    isAvailable,
                };
            }
        }
        const user = await User.findById(userId)

        const CustomerName = user.name;
        const CustomerEmail = user.email;
        const CustomerPhone = user.phone;


        // ✅ Generate order number
        const orderNumber = calculateOrderNumber();

        // ✅ Prepare order data
        const dataOfOrder = {
            orderNumber,
            userId,
            items: orderItems,
            subTotal,
            finalAmount: totalCartPrice,
            coupanCode: coupanCode || null,
            tableNumber: tableNO || null,
            customerEmail: CustomerEmail || null,
            customerName: CustomerName || null,
            customerPhone: CustomerPhone || null,
            notes,
            paymentMethod,
        };




        if (paymentMethod === "cash") {
            console.log("This is Playyyyyyyyyyyyy")
            const order = await Order.create(dataOfOrder);
            return res.status(201).json({
                message: "Order placed Successfully",
                data: order
            })
        }
        if (paymentMethod === "razorpay") {
            if (!razorpay) {
                return res.status(503).json({
                    message: "Razorpay is not configured. Add RAZORPAY_API_KEY and RAZORPAY_API_SECRET.",
                });
            }

            const options = {
                amount: totalCartPrice * 100,
                currency: "INR",
                receipt: orderNumber,
                notes: {
                    CustomerEmail,
                    CustomerPhone,
                    CustomerName,
                },
            };

            const razorPayOrder = await razorpay.orders.create(options);

            dataOfOrder.razorPayOrderId = razorPayOrder.id;
            const order = await Order.create(dataOfOrder);

            return res.status(200).json({
                order,
                razorPayOrder,
                key: process.env.RAZORPAY_API_KEY,
            });
        }




        // ✅ Save order to DB
     

        // ✅ Response
        res.json({
            order: order,
            cartItems,
            CustomerName,
            tableNumber,
            CustomerEmail,
            CustomerPhone,
            CoupansAfterCalculation,
            table: tableNO,
        });

    } catch (error) {
        next(error);
    }
};


exports.verifypayment = async (req, res, next) => {
    try {
        if (!razorpay) {
            return res.status(503).json({
                success: false,
                message: "Razorpay is not configured. Add RAZORPAY_API_KEY and RAZORPAY_API_SECRET.",
            });
        }

        const { paymentId, signature, razorPayOrderId } = req.body;

        const order = await Order.findOne({ razorPayOrderId });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        const generated_signature = crypto
            .createHmac('sha256', process.env.RAZORPAY_API_SECRET)
            .update(`${razorPayOrderId}|${paymentId}`)
            .digest('hex');

        // ✅ IMPORTANT: return added
        if (generated_signature !== signature) {
            return res.status(400).json({
                success: false,
                message: 'Payment verification failed!',
            });
        }

        const payment = await razorpay.payments.fetch(paymentId);
        console.log(payment);

        // ✅ Ensure finalAmount exists (safety net)
        if (!order.finalAmount) {
            order.finalAmount = order.totalAmount; // fallback
        }

        if (payment.status === 'captured' || payment.status === 'authorized') {
            order.paymentStatus = 'confirmed';
            order.razorPaySignature = signature;
            order.razorPayPaymentId = paymentId;
            await order.save();

            const cart = await Cart.findOne({ userId: order.userId })
            if (cart) {
                cart.items = [];
                cart.totalCartPrice = 0;
                cart.discountAmount = 0;
                cart.coupan = null;
                await cart.save()

            }
            const user = await User.findById(order.userId)
            if (user) {
                user.totalOrders += 1
                await user.save();
            }
        } else if (payment.status === 'failed') {
            order.paymentStatus = 'failed';
            await order.save();
        }

        return res.status(200).json({
            success: true,
            message: 'Payment Verified',
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};
exports.getorder = async (req, res, next) => {
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
            filter.userId = mongoose.Types.ObjectId(userId);
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
        const { id } = req.params; // orderId
        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(400).json({ message: "Invalid order ID" });

        const order = await Order.findById(id);
        if (!order) return res.status(404).json({ message: "Order not found" });

        res.status(200).json({ order });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.monthlysales = async (req, res, next) => {
    try {
        const sales = await Order.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    totalSales: { $sum: "$finalAmount" },
                    orders: { $sum: 1 },

                }
            },
            { $sort: { "_id": 1 } }
        ])
        res.json({
            success: true, sales
        })
    } catch (error) {
        console.error("Monthly sales error:", error);
        res.status(500).json({ message: error.message });
    }
}
