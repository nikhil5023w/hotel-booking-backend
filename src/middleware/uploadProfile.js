// import multer from "multer";
// import { CloudinaryStorage } from "multer-storage-cloudinary";
// import cloudinary from "../config/cloudinary.js";
// console.log("Cloudinary in updateProfile :", process.env.CLOUDINARY_NAME ? "Loaded" : "Missing");

// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: "hotel_booking/profile_picture",
//     allowed_formats: ["jpg", "png", "jpeg", "webp"],
//     transformation: [{ width: 400, height: 400, crop: "fill" }],
//   },
// });

// const upload = multer({
//   storage,
//   limits: {
//     fileSize: 1 * 1024 * 1024, // 1MB
//   },
// });

// export default upload;


import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
console.log("Cloudinary in updateProfile :", process.env.CLOUDINARY_CLOUD_NAME ? "Loaded" : "Missing");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "hotel_booking/profile_picture",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    transformation: [{ width: 400, height: 400, crop: "fill" }],
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 1 * 1024 * 1024, // 1MB
  },
});

export default upload;
