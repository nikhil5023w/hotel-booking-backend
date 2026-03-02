import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

console.log("Cloudinary in uploadMiddleware :", process.env.CLOUDINARY_NAME ? "Loaded" : "Missing");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "id_proofs",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });

export default upload;
