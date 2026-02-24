const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  items: [
    {
      menuItemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Menu",
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
        min: 1,
      },
    },
  ],
 tableNumber: {
    type: Number,
    required: true,
  },

  totalCartPrice: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.models.Cart || mongoose.model("Cart", cartSchema);
