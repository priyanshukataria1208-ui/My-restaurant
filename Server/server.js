const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// JSON Parser
app.use(express.json());

// ✅ ROOT ROUTE (IMPORTANT)
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// ✅ CORS FIX
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL, // add your vercel frontend URL in env
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.log("Blocked by CORS:", origin);
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ✅ DB CONNECT FIX (IMPORTANT FOR VERCEL)
const dbconnect = require("./config/database");

let isConnected = false;

const connectDB = async () => {
  if (!isConnected) {
    await dbconnect();
    isConnected = true;
    console.log("MongoDB Connected");
  }
};

connectDB();

// ✅ ROUTES
const Frontendroute = require("./Router/Frontendroute");
const Tableroute = require("./Router/tablerouter");
const SessionRoutes = require("./Router/sessionroute");
const Getuser = require("./Router/userroute");
const menuroute = require("./Router/Menuroute");
const Productroute = require("./Router/Products");
const Cardroute = require("./Router/Cartroute");
const Coupanroute = require("./Router/Coupenroute");
const Orderroute = require("./Router/Orderroute");
const Admin = require("./Router/Amdmin");

app.use("/api/v1", Frontendroute);
app.use("/api/v1", Tableroute);
app.use("/api/v1", SessionRoutes);
app.use("/api/v1", Getuser);
app.use("/api/v1", menuroute);
app.use("/api/v1", Productroute);
app.use("/api/v1", Cardroute);
app.use("/api/v1", Coupanroute);
app.use("/api/v1", Orderroute);
app.use("/api/v1", Admin);

// ✅ PROTECTED ROUTE FIX
const verifytoken = require("./middleware/verifytoken");
const { default: checkRole } = require("./middleware/checkRole");

app.get(
  "/api/v1/menu",
  verifytoken,
  checkRole(["customer", "admin"]),
  (req, res) => {
    res.json({ message: "Menu Loaded Successfully" });
  }
);

// ✅ TEST ROUTE


// ✅ STATS ROUTE
app.get("/api/v1/stats", (req, res) => {
  res.json({
    orders: Math.floor(Math.random() * 2000),
    customers: Math.floor(Math.random() * 10000),
    menu: Math.floor(Math.random() * 600),
    income: Math.floor(Math.random() * 20000),
  });
});

// ✅ ERROR HANDLER
app.use((err, req, res, next) => {
  console.log(err.message);
  res.status(500).json({
    message: err.message || "Server error",
  });
});
app.get("/api", (req, res) => {
  res.send("API RUNNING 🚀");
});
app.get("/api/v1/test", (req, res) => {
  res.json({ message: "V1 API WORKING 🚀" });
});


// ✅ EXPORT FOR VERCEL
module.exports = app;
