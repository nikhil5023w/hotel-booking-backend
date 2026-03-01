import express from "express";
import protect from "../middleware/authMiddleware.js";
import { cancelBooking } from "../controllers/refundController.js";

const router = express.Router();

router.post("/:bookingId", protect, cancelBooking);

export default router;
