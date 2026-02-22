const Coupan = require("../Models/coupen")
const User = require("../Models/User")
const Cart = require("../Models/cart");


exports.getAllcoupan = async (req, res) => {
  try {
    const { cartTotal } = req.query;
    const userId = req.user.id;

    const user = await User.findById(userId);
    console.log('fetched from database', user);
    //user cart fetch //totalCartPrice ;
    const cart = await Cart.findOne({ userId });
    let totalCartPrice;
    if (cart) {
      totalCartPrice = cart.totalCartPrice;
    }
    console.log(totalCartPrice);

    //how to fetch all coupans than apply map method ;
    const allCoupans = await Coupan.find();
    console.log(allCoupans);

    // const AvailableCoupans = allCoupans.filter((coupan) => {
    //   return (
    //     totalCartPrice > coupan.minOrderAmount &&
    //     new Date() > coupan.validFrom &&
    //     new Date() < coupan.validTo
    //   );
    // });
    // console.log(filteredCoupans)
    //discount value again the totalprice ;

    const CoupansAfterCalculation = allCoupans.map((coupans) => {
      const now = new Date();
      const validFrom = coupans.validFrom ? new Date(coupans.validFrom) : new Date("1970-01-01");
      const validTo = coupans.validTo ? new Date(coupans.validTo) : new Date("9999-12-31");

      const minOrderMet = totalCartPrice >= (coupans.minOrderAmount || 0);
      const valid = now >= validFrom && now <= validTo;
      const firstOrderValid = coupans.isFirstOrder ? user.totalOrders === 0 : true;

      const isAvailable = coupans.isActive && minOrderMet && valid && firstOrderValid;

      console.log("DEBUG COUPON:", coupans.code, {
        isActive: coupans.isActive,
        minOrderMet,
        valid,
        firstOrderValid,
        totalCartPrice,
        minOrderAmount: coupans.minOrderAmount
      });

      let discountAmount = 0;
      if (coupans.discountType === "fixedAmount") discountAmount = coupans.discountValue;
      if (coupans.discountType === "percentage") {
        discountAmount = (totalCartPrice * coupans.discountValue) / 100;
        if (coupans.maxDiscount && discountAmount > coupans.maxDiscount) discountAmount = coupans.maxDiscount;
      }

      return {
        ...coupans._doc,
        finalAmount: totalCartPrice - discountAmount,
        discountAmount,
        isAvailable
      };
    });

    //  500 * 10 / 100 => 50
    //1000 * 10 / 100 => 100   maxDiscount = 150
    //2000 * 10 / 200 > maxDiscount = 150
    // disocuntValue = maxDiscount;
    res.json({
      CoupansAfterCalculation,
    });
  } catch (error) { }
};

exports.registerCoupan = async (req, res, next) => {
  try {
    const {
      code,
      discountValue,
      maxDiscount,
      validFrom,
      discountType,
      validTo,
      isFirstOrder,
      usageLimit,
      minOrderAmount,
      description,
    } = req.body;

    if (!code || !discountValue) {
      return res.status(400).json({ message: "Code and discountType are required" });
    }

    const existingCoupan = await Coupan.findOne({ code: code.toUpperCase() });
    if (existingCoupan) {
      return res.status(400).json({ message: "Coupan code already exists" });
    }


    const coupanData = {
      code: code.toUpperCase(),

      maxDiscount: maxDiscount || null,
      validFrom: validFrom || new Date(),
      validTo: validTo || null,
      discountType,
      isFirstOrder: isFirstOrder || false,
      usageLimit: usageLimit || null,
      minOrderAmount: minOrderAmount || 0,
      discountValue,
      description: description || "",
      isActive: true,
      usedCount: 0,
    };

    const savedCoupan = await new Coupan(coupanData).save();

    res.status(201).json({
      message: "Coupan created successfully",
      coupan: savedCoupan,
    });
  } catch (error) {
    console.error("Error registering coupan:", error);
    next(error)
  }
};





// APPLY COUPON
exports.applyCoupon = async (req, res) => {
  try {
    const { couponCode } = req.body;
    const userId = req.user.id; // 🔥 JWT se

    if (!couponCode || !userId) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    // 1️⃣ Fetch cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const cartTotal = cart.totalCartPrice;

    // 2️⃣ Fetch coupon
    const coupon = await Coupan.findOne({
      code: couponCode.toUpperCase(),
      isActive: true,
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found or inactive",
      });
    }

    // 3️⃣ Date validation
    const now = new Date();
    if (
      (coupon.validFrom && now < coupon.validFrom) ||
      (coupon.validTo && now > coupon.validTo)
    ) {
      return res.status(400).json({
        success: false,
        message: "Coupon expired or not active yet",
      });
    }

    // 4️⃣ Min order check
    if (cartTotal < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order ₹${coupon.minOrderAmount} required`,
      });
    }

    // 5️⃣ First order check
    if (coupon.isFirstOrder) {
      const user = await User.findById(userId);
      if (user.totalOrders > 0) {
        return res.status(400).json({
          success: false,
          message: "Coupon valid only on first order",
        });
      }
    }

    // 6️⃣ Usage limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({
        success: false,
        message: "Coupon usage limit reached",
      });
    }

    // 7️⃣ Discount calculation
    let discount = 0;
    if (coupon.discountType === "fixedAmount") {
      discount = coupon.discountValue;
    }

    if (coupon.discountType === "percentage") {
      discount = (cartTotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount);
      }
    }

    // 8️⃣ Save cart
    cart.appliedCoupon = coupon.code;
    cart.discount = discount;
    await cart.save();

    // 9️⃣ Increment usage
    coupon.usedCount += 1;
    await coupon.save();

    return res.json({
      success: true,
      cart,
      discount,
      appliedCoupon: coupon.code,
      message: `Coupon ${coupon.code} applied successfully`,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};



// Get all coupons for admin
exports.getAllCoupansAdmin = async (req, res) => {
  try {
    const coupons = await Coupan.find().sort({ createdAt: -1 }); // newest first
    res.json({
      success: true,
      totalCoupons: coupons.length,
      coupons,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Toggle Active / Inactive
exports.toggleCouponStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupan.findById(id);
    if (!coupon) return res.status(404).json({ success: false, message: "Coupon not found" });

    coupon.isActive = !coupon.isActive;
    await coupon.save();

    res.json({
      success: true,
      message: `Coupon ${coupon.code} is now ${coupon.isActive ? "Active" : "Inactive"}`,
      coupon,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


