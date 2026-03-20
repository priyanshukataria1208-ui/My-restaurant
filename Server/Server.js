const express = require("express");
const cors = require("cors");
const app = express();
require('events').EventEmitter.defaultMaxListeners = 20; 
require("dotenv").config();

// JSON Parser
app.use(express.json());

// CORS
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
]
  .flatMap((value) => (value ? value.split(",") : []))
  .map((value) => value.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "PUT", "POST","PATCH", "DELETE"],
    credentials: true,
  })
);

// DB Connect (Only once!)
const dbconnect = require("./config/database");
dbconnect();

// Middleware
const verifytoken = require("./middleware/verifytoken");
const { default: checkRole } = require("./middleware/checkRole");

// Public routes
const Frontendroute = require("./Router/Frontendroute");
app.use("/api/v1", Frontendroute);


const Tableroute = require("./Router/tablerouter");
const { error } = require("console");

const SessionRoutes = require("./Router/sessionroute")
const Getuser = require("./Router/userroute")
const menuroute=require("./Router/Menuroute")
const Productroute=require("./Router/Products")
const Cardroute=require("./Router/Cartroute")
const Coupanroute=require("./Router/Coupenroute")
const Orderroute=require("./Router/Orderroute")
const Admin=require("./Router/Amdmin")

app.use("/api/v1", Tableroute)
app.use('/api/v1', SessionRoutes)
app.use("/api/v1", Getuser)
app.use("/api/v1",menuroute)
app.use("/api/v1",Productroute)
app.use("/api/v1",Cardroute)
app.use("/api/v1",Coupanroute)
app.use("/api/v1",Orderroute)
app.use("/api/v1",Admin)



// Protected Route Example
app.get(
  "/menu",
  verifytoken,
  checkRole(["customer", "admin"]),
  (req, res) => {
    res.json({ message: "Menu Loaded Successfully (Protected Route)" });
  }
);

app.use((err, req, res, next) => {
  if (err) {
    console.log(err)
    res.status(err.status || 500).json({
      message: err?.message || "server error"
    })
  }
})

// Static Files
app.use(express.static("public"));
app.get("/api/v1/stats", (req, res) => {
  // Random numbers generate kar rahe demo ke liye
  const statsData = {
    orders: Math.floor(Math.random() * 2000),      // 0-1999
    customers: Math.floor(Math.random() * 10000),  // 0-9999
    menu: Math.floor(Math.random() * 600),         // 0-599
    income: Math.floor(Math.random() * 20000)      // 0-19999
  };
  res.json(statsData);
});
// Start Server (Only once!)
const PORT = process.env.PORT || 3000;
if (process.env.VERCEL !== "1") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;










