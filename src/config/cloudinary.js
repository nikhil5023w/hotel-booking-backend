// import { v2 as cloudinary } from "cloudinary";

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_SECRET,
//   secure: true,
// });

// console.log(
//   "Cloudinary Config:",
//   process.env.CLOUDINARY_NAME ? "Loaded" : "Missing"
// );

// export default cloudinary;


import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

console.log("Cloudinary ENV:", {
  cloudName: cloudName ? "OK" : "MISSING",
  apiKey: apiKey ? "OK" : "MISSING",
  apiSecret: apiSecret ? "OK" : "MISSING",
});

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

export default cloudinary;