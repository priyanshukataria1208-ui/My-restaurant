const cloudinary = require('cloudinary').v2;




const dotenv=require("dotenv")
dotenv.config();
try {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('connected.....cloudinary');
} catch (error) {
  console.log(error);
}
module.exports=cloudinary
