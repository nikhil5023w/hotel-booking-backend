// import express from "express";
// import protect from "../middleware/authMiddleware.js";
// import adminOnly from "../middleware/adminMiddleware.js";

// import {
//   createRoom,
//   getRooms,
//   getRoomById,
//   updateRoom,
//   deleteRoom,
// } from "../controllers/roomController.js";

// const router = express.Router();

// router.get("/", getRooms);
// router.get("/:id", getRoomById);

// router.post("/", protect, adminOnly, createRoom);
// router.put("/:id", protect, adminOnly, updateRoom);
// router.delete("/:id", protect, adminOnly, deleteRoom);

// export default router;


import express from "express";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";
import roomUpload from "../middleware/roomUploadMiddleware.js";

import {
  createRoom,
  getRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
} from "../controllers/roomController.js";

const router = express.Router();

router.get("/", getRooms);
router.get("/:id", getRoomById);

router.post(
  "/",
  protect,
  adminOnly,
  roomUpload.fields([
    { name: "coverImages", maxCount: 5 },
    { name: "galleryImages", maxCount: 10 },
  ]),
  createRoom,
);
router.put(
  "/:id",
  protect,
  adminOnly,
  roomUpload.fields([
    { name: "coverImages", maxCount: 5 },
    { name: "galleryImages", maxCount: 10 },
  ]),
  updateRoom,
);
router.delete("/:id", protect, adminOnly, deleteRoom);

export default router;
