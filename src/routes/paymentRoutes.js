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

export default router;
