const Razorpay=require("razorpay");

const dotenv=require("dotenv");

dotenv.config();

const hasRazorpayConfig =
    Boolean(process.env.RAZORPAY_API_KEY) &&
    Boolean(process.env.RAZORPAY_API_SECRET);

const razorpay = hasRazorpayConfig
    ? new Razorpay({
        key_id: process.env.RAZORPAY_API_KEY,
        key_secret: process.env.RAZORPAY_API_SECRET
    })
    : null;

module.exports=razorpay
