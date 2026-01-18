Restaurant Management System with QR Code Based Ordering

🔹 System Roles
👤 Customer

Scans the QR code

Views the digital menu

Adds or removes items from the cart

Places the order

Makes online payment

🧑‍💼 Admin

Manages menu items (Add / Update / Delete)

Creates tables and generates QR codes

Tracks incoming orders

Monitors payment status

🔹 Technology Stack
Frontend

React.js

Redux Toolkit for cart and menu state management

Tailwind CSS / CSS

Axios for API communication

Backend

Node.js

Express.js

RESTful APIs

Database

MongoDB

Mongoose ODM

Other Tools

QR Code Generator

Razorpay Payment Gateway

JWT Authentication

🔹 Project Flow (End-to-End)
1️⃣ Table Creation

Admin creates a table with table number and capacity

System automatically generates a QR code

QR code contains the table ID and session token

2️⃣ QR Code Scan

Customer scans the QR code using a mobile device

The menu page opens

A session is created based on the table

3️⃣ Menu & Cart System

Menu is fetched from the backend

Cart is managed using Redux

Item quantity can be increased or decreased

Total amount is calculated automatically

4️⃣ Order Placement

A unique order number is generated

Order details are stored in the database

Initial order status is set to Pending

5️⃣ Payment System

Razorpay checkout is triggered

After successful payment:

Order status is updated to Paid

Payment ID is stored in the database

6️⃣ Admin Dashboard

Admin can view real-time orders

Order status can be updated to:

Preparing

Served

Completed

🔹 Database Models
Table Model

tableNumber

capacity

qrCode

isActive

Menu Model

name

price

category

availability

Order Model

orderNumber

tableId

items

totalAmount

paymentStatus

orderStatus
