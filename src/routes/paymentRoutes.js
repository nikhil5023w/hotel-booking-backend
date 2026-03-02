// import express from "express";
// import protect from "../middleware/authMiddleware.js";
// import { createCheckoutSession } from "../controllers/paymentController.js";
// import upload from "../middleware/uploadMiddleware.js";

// const router = express.Router();

// router.post(
//   "/checkout",
//   protect,
//   upload.single("idProof"),
//   createCheckoutSession,
// );

// export default router;
import express from "express";
import protect from "../middleware/authMiddleware.js";
import { createCheckoutSession } from "../controllers/paymentController.js";
import upload from "../middleware/uploadMiddleware.js";
import Booking from "../models/Booking.js";
import { getStripe } from "../config/stripe.js";

const router = express.Router();

router.post(
  "/checkout",
  (req, res, next) => {
    console.log("STEP 1: payment route hit");
    next();
  },
  protect,
  (req, res, next) => {
    console.log("STEP 2: auth middleware passed");
    next();
  },
  upload.single("idProof"),
  (req, res, next) => {
    console.log("STEP 3: file upload passed");
    next();
  },
  createCheckoutSession,
);



router.get("/verify-session", protect, async (req, res) => {
  try {
    const { session_id } = req.query;

    const stripe = getStripe();

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== "paid") {
      return res.status(400).json({ success: false });
    }

    const booking = await Booking.findOne({
      stripeSessionId: session.id,
    }).populate("room");

    if (!booking) {
      return res.status(404).json({ success: false });
    }

    res.json({
      success: true,
      booking,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
