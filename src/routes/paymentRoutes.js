import express from "express";
import protect from "../middleware/authMiddleware.js";
import { createCheckoutSession } from "../controllers/paymentController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post(
  "/checkout",
  protect,
  upload.single("idProof"),
  createCheckoutSession,
);

export default router;
