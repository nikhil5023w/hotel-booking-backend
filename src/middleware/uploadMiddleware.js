// import multer from "multer";
// import { CloudinaryStorage } from "multer-storage-cloudinary";
// import cloudinary from "../config/cloudinary.js";

// console.log("Cloudinary in uploadMiddleware :", process.env.CLOUDINARY_NAME ? "Loaded" : "Missing");

// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: "id_proofs",
//     allowed_formats: ["jpg", "png", "jpeg"],
//   },
// });

// const upload = multer({ storage });

// export default upload;

import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

console.log(
  "Cloudinary in uploadMiddleware:",
  process.env.CLOUDINARY_NAME ? "Loaded" : "Missing",
);
console.log("Cloudinary NAME:", process.env.CLOUDINARY_NAME);
console.log(
  "Cloudinary KEY:",
  process.env.CLOUDINARY_API_KEY ? "Loaded" : "Missing",
);
console.log(
  "Cloudinary SECRET:",
  process.env.CLOUDINARY_SECRET ? "Loaded" : "Missing",
);
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "id_proofs",
    resource_type: "image",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });

export default upload;
