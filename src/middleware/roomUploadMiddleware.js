import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "room_images/gallery";

    if (file.fieldname === "coverImages") {
      folder = "room_images/cover";
    }

    return {
      folder,
      allowed_formats: ["jpg", "png", "jpeg", "webp"],
    };
  },
});

const roomUpload = multer({ storage });

export default roomUpload;
