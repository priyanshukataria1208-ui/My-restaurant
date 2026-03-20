const Cart = require("../Models/cart");
const Menu = require("../Models/menu");
const User = require("../Models/User");

// ================= HELPER =================
const calculateTotal = async (cart) => {
  let total = 0;
  for (const item of cart.items) {
    const menu = await Menu.findById(item.menuItemId);
    if (menu) {
      total += Number(menu.price) * Number(item.quantity);
    }
  }
  return total;
};

// ================= ADD TO CART =================
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { menuItemId, quantity = 1, tableNumber } = req.body;

    if (!menuItemId) {
      return res.status(400).json({ message: "menuItemId missing" });
    }

    let cart = await Cart.findOne({ userId });

    // 🆕 first time cart
    if (!cart) {
      cart = new Cart({
        userId,
        tableNumber: tableNumber || undefined,
        items: [],
      });
    }

    if (!cart.tableNumber && tableNumber) {
      cart.tableNumber = tableNumber;
    }

    const menuItem = await Menu.findById(menuItemId);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    const existingItem = cart.items.find(
      (i) => i.menuItemId.toString() === menuItemId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ menuItemId, quantity });
    }

    cart.totalCartPrice = await calculateTotal(cart);
    await cart.save();

    res.status(201).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ================= GET CART =================
exports.getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    // 👤 USER
    const user = await User.findById(userId).select("name email phone");

    // 🛒 CART
    const cart = await Cart.findOne({ userId })
      .populate("items.menuItemId");

    // ❌ cart not found
    if (!cart) {
      return res.json({
        success: true,
        cart: {
          items: [],
          totalCartPrice: 0,
          tableNumber: null,
          appliedCoupon: null,
          discount: 0,
        },
        user,
      });
    }

    // ✅ FINAL RESPONSE
    res.json({
      success: true,
      cart: {
        items: cart.items,
        totalCartPrice: cart.totalCartPrice,
        tableNumber: cart.tableNumber,
        appliedCoupon: cart.appliedCoupon || null,
        discount: cart.discount || 0,
      },
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ================= INCREMENT =================
exports.incrementQuantity = async (req, res) => {
  try {
    const userId = req.user._id;
    const { menuItemId } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      (i) => i.menuItemId.toString() === menuItemId
    );
    if (!item) return res.status(404).json({ message: "Item not in cart" });

    item.quantity += 1;
    cart.totalCartPrice = await calculateTotal(cart);
    await cart.save();

    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ================= DECREMENT =================
exports.decrementQuantity = async (req, res) => {
  try {
    const userId = req.user._id;
    const { menuItemId } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      (i) => i.menuItemId.toString() === menuItemId
    );
    if (!item) return res.status(404).json({ message: "Item not in cart" });

    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      cart.items = cart.items.filter(
        (i) => i.menuItemId.toString() !== menuItemId
      );
    }

    cart.totalCartPrice = await calculateTotal(cart);
    await cart.save();

    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ================= REMOVE ITEM =================
exports.removeItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { menuItemId } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (i) => i.menuItemId.toString() !== menuItemId
    );

    cart.totalCartPrice = await calculateTotal(cart);
    await cart.save();

    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
