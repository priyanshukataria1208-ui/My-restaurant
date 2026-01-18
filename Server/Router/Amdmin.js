const express = require("express");
const router = express.Router();

// Models import karo
const Order = require("../Models/order");
const Menu = require("../Models/menu");
const User = require("../Models/User");

// GET /api/v1/stats
router.get("/stats", async (req, res) => {
    try {
   const ordersCount = await Order.countDocuments();
    const menuCount = await Menu.countDocuments();
    const customersCount = await User.countDocuments();

        const incomeResult = await Order.aggregate([
            { $group: { _id: null, total: { $sum: "$finalAmount"} } }
        ]);
        const income = incomeResult[0]?.total || 0;

        res.json({
            orders: ordersCount,
            customers: customersCount,
            menu: menuCount,
            income: income
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
