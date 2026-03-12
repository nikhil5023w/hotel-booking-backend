// import express from "express";

// import {
//   registerUser,
//   loginUser,
//   changePassword,
//   forgotPassword,
//   resetPassword,
// } from "../controllers/authController.js";
// import { verifyEmail, googleLogin } from "../controllers/authController.js";
// import protect from "../middleware/authMiddleware.js";
// const router = express.Router();

// // AUTH
// router.post("/register", registerUser);
// router.post("/login", loginUser);
// router.get("/verify-email/:token", verifyEmail);
// router.post("/google-login", googleLogin);
// // PASSWORD FEATURES
// router.put("/change-password", protect, changePassword);
// router.post("/forgot-password", forgotPassword);
// router.post("/reset-password/:token", resetPassword);

// export default router;

import express from "express";
import {
  registerUser,
  loginUser,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  googleLogin,
  getProfile,
  updateProfile,
  resendVerification,
} from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadProfile.js";
const router = express.Router();

// AUTH
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/resend-verification", resendVerification);
router.get("/verify-email/:token", verifyEmail);
router.post("/google-login", googleLogin);
// PASSWORD FEATURES

router.get("/me", protect, getProfile);
router.put(
  "/update-profile",
  protect,
  upload.single("profileImage"),
  updateProfile,
);

router.put("/change-password", protect, changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
