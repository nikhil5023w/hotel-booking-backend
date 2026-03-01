import express from "express";
import { getRoomAvailability } from "../controllers/availabilityController.js";

const router = express.Router();

router.get("/:roomId", getRoomAvailability);

export default router;
