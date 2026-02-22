const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    sessionToken: {
      type: String,
    },

    items: [
      {
        menuItemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Menu",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        subTotal: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],

    subTotal: {
      type: Number,
      required: true,
      min: 0,
    },

    discountAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    coupanCode: {
      type: String,
    },

    finalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    tableNumber: {
      type: Number,
    },

    customerEmail: {
      type: String,
      trim: true,
    },

    customerName: {
      type: String,
      trim: true,
    },

    notes: {
      type: String,
      trim: true,
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "razorpay"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "failed", "confirmed", "refund"],
      default: "pending",
    },

    orderStatus: {
      type: String,
      enum: ["pending", "preparing", "ready", "served"],
      default: "pending",
    },
    

    razorPayOrderId: {type:String},
    razorPayPaymentId: {type:String},
    razorPaySignature: {type:String},
    createdAt:{
      type:Date,
      default:Date.now,
    }
  },

  {
    timestamps: true, // ✅ createdAt & updatedAt
  }
);

module.exports = mongoose.model("Order", orderSchema);
