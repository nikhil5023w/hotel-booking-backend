import express from "express";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";



import {
  createBooking,
  getMyBookings,
  getAllBookings,
  cancelBooking,
  getLastGuestDetails,
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/", protect, createBooking);
router.get("/my", protect, getMyBookings);
router.get("/", protect, adminOnly, getAllBookings);
router.get("/guest-details/last", protect, getLastGuestDetails);
router.put("/:id/cancel", protect, cancelBooking);

export default router;
