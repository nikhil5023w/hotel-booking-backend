import express from "express";
import { handleWebhook } from "../controllers/webhookController.js";

const router = express.Router();

// IMPORTANT: raw body
router.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  handleWebhook
);

export default router;
