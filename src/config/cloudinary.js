import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
  secure: true,
});

console.log(
  "Cloudinary Config:",
  process.env.CLOUDINARY_NAME ? "Loaded" : "Missing"
);

export default cloudinary;