const mongoose = require("mongoose");

const dbconnect = async () => {
  try {
    await mongoose.connect("mongodb+srv://Priyanshu:Priyanshu@cluster0.l55hips.mongodb.net/?appName=Cluster0");
    console.log("DB Connected ✔️");
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
  }
};

module.exports = dbconnect;






