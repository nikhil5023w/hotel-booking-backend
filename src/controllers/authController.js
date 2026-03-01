// import User from "../models/User.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import crypto from "crypto";
// import { sendEmail } from "../utils/sendEmail.js";
// import { OAuth2Client } from "google-auth-library";

// // Generate JWT
// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: "7d",
//   });
// };

// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// // REGISTER
// export const registerUser = async (req, res, next) => {
//   try {
//     const { name, email, password } = req.body;

//     const userExists = await User.findOne({ email });

//     if (userExists)
//       return res.status(400).json({ message: "User already exists" });

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const verificationToken = crypto.randomBytes(20).toString("hex");

//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       verificationToken: crypto
//         .createHash("sha256")
//         .update(verificationToken)
//         .digest("hex"),
//       verificationExpire: Date.now() + 24 * 60 * 60 * 1000,
//     });

//     const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

//     const message = `
//       <h3>Email Verification</h3>
//       <p>Click below to verify your email:</p>
//       <a href="${verifyUrl}">${verifyUrl}</a>
//     `;

//     await sendEmail(user.email, "Verify Email", message);

//     res.status(201).json({
//       message: "Verification email sent",
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const googleLogin = async (req, res, next) => {
//   try {
//     const { credential } = req.body;

//     if (!credential)
//       return res.status(400).json({ message: "No credential received" });

//     const ticket = await client.verifyIdToken({
//       idToken: credential,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });

//     const payload = ticket.getPayload();

//     let user = await User.findOne({ email: payload.email });

//     // Create user if not exists
//     if (!user) {
//       user = await User.create({
//         name: payload.name,
//         email: payload.email,
//         googleId: payload.sub,
//         isVerified: true,
//         role: "user", // default role
//       });
//     }

//     const token = generateToken(user._id);

//     res.json({
//       name: user.name,
//       email: user.email,
//       role: user.role, // ⭐ IMPORTANT
//       token,
//     });
//   } catch (error) {
//     console.error("Google Login Error:", error);
//     res.status(500).json({ message: "Google authentication failed" });
//   }
// };

// // verify login
// export const verifyEmail = async (req, res, next) => {
//   try {
//     const token = crypto
//       .createHash("sha256")
//       .update(req.params.token)
//       .digest("hex");

//     const user = await User.findOne({
//       verificationToken: token,
//       verificationExpire: { $gt: Date.now() },
//     });

//     if (!user)
//       return res.status(400).json({ message: "Invalid or expired token" });

//     user.isVerified = true;
//     user.verificationToken = undefined;
//     user.verificationExpire = undefined;

//     await user.save();

//     res.json({ message: "Email verified successfully" });
//   } catch (error) {
//     next(error);
//   }
// };

// // LOGIN
// export const loginUser = async (req, res, next) => {
//   try {
//     const { email, password, rememberMe } = req.body;

//     const user = await User.findOne({ email });

//     if (!user) return res.status(401).json({ message: "Invalid credentials" });

//     if (!user.isVerified)
//       return res.status(401).json({ message: "Please verify email first" });

//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch)
//       return res.status(401).json({ message: "Invalid credentials" });

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: rememberMe ? "30d" : "7d",
//     });

//     res.json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       token,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // CHANGE PASSWORD
// export const changePassword = async (req, res, next) => {
//   try {
//     const { currentPassword, newPassword } = req.body;

//     const user = await User.findById(req.user.id);

//     const isMatch = await bcrypt.compare(currentPassword, user.password);

//     if (!isMatch) {
//       return res.status(400).json({ message: "Current password incorrect" });
//     }

//     user.password = await bcrypt.hash(newPassword, 10);
//     await user.save();

//     res.json({ message: "Password updated successfully" });
//   } catch (error) {
//     next(error);
//   }
// };

// // FORGOT PASSWORD
// export const forgotPassword = async (req, res, next) => {
//   try {
//     const { email } = req.body;

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // generate token
//     const resetToken = crypto.randomBytes(20).toString("hex");

//     // hash token
//     user.resetPasswordToken = crypto
//       .createHash("sha256")
//       .update(resetToken)
//       .digest("hex");

//     user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 min

//     await user.save();

//     const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

//     const message = `
//       <h3>Password Reset</h3>
//       <p>Click below link to reset password:</p>
//       <a href="${resetUrl}">${resetUrl}</a>
//     `;

//     await sendEmail(user.email, "Password Reset", message);

//     res.json({ message: "Reset email sent" });
//   } catch (error) {
//     next(error);
//   }
// };

// // RESET PASSWORD
// export const resetPassword = async (req, res, next) => {
//   try {
//     const resetPasswordToken = crypto
//       .createHash("sha256")
//       .update(req.params.token)
//       .digest("hex");

//     const user = await User.findOne({
//       resetPasswordToken,
//       resetPasswordExpire: { $gt: Date.now() },
//     });

//     if (!user) {
//       return res.status(400).json({ message: "Invalid or expired token" });
//     }

//     user.password = await bcrypt.hash(req.body.password, 10);
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpire = undefined;
//     user.isVerified = true;

//     await user.save();

//     res.json({ message: "Password reset successful" });
//   } catch (error) {
//     next(error);
//   }
// };

import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";
import { OAuth2Client } from "google-auth-library";
import cloudinary from "../config/cloudinary.js";

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// REGISTER
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(20).toString("hex");

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      verificationToken: crypto
        .createHash("sha256")
        .update(verificationToken)
        .digest("hex"),
      verificationExpire: Date.now() + 24 * 60 * 60 * 1000,
    });

    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

    const message = `
      <h3>Email Verification</h3>
      <p>Click below to verify your email:</p>
      <a href="${verifyUrl}">${verifyUrl}</a>
    `;

    await sendEmail(user.email, "Verify Email", message);

    res.status(201).json({
      message: "Verification email sent",
    });
  } catch (error) {
    next(error);
  }
};

export const googleLogin = async (req, res, next) => {
  try {
    const { credential } = req.body;

    if (!credential)
      return res.status(400).json({ message: "No credential received" });

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    let user = await User.findOne({ email: payload.email });

    // Create user if not exists
    if (!user) {
      user = await User.create({
        name: payload.name,
        email: payload.email,
        googleId: payload.sub,
        isVerified: true,
        role: "user", // default role
      });
    }

    const token = generateToken(user._id);

    res.json({
      name: user.name,
      email: user.email,
      role: user.role, // ⭐ IMPORTANT
      token,
    });
  } catch (error) {
    console.error("Google Login Error:", error);
    res.status(500).json({ message: "Google authentication failed" });
  }
};

// verify login
export const verifyEmail = async (req, res, next) => {
  try {
    const token = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      verificationToken: token,
      verificationExpire: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationExpire = undefined;

    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    next(error);
  }
};

// LOGIN
export const loginUser = async (req, res, next) => {
  try {
    const { email, password, rememberMe } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    if (!user.isVerified)
      return res.status(401).json({ message: "Please verify email first" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: rememberMe ? "30d" : "7d",
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    next(error);
  }
};

// CHANGE PASSWORD
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Current password incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
};

// FORGOT PASSWORD
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // generate token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // hash token
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 min

    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const message = `
      <h3>Password Reset</h3>
      <p>Click below link to reset password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
    `;

    await sendEmail(user.email, "Password Reset", message);

    res.json({ message: "Reset email sent" });
  } catch (error) {
    next(error);
  }
};

// RESET PASSWORD
export const resetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = await bcrypt.hash(req.body.password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    user.isVerified = true;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.json(user);
  } catch (error) {
    next(error);
  }
};
export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, location, bio, language } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // DELETE OLD IMAGE IF NEW IMAGE UPLOADED
    if (req.file && user.profileImage) {
      const publicId = user.profileImage
        .split("/")
        .slice(-2)
        .join("/")
        .split(".")[0];

      await cloudinary.uploader.destroy(publicId);
    }

    // UPDATE IMAGE
    if (req.file) {
      user.profileImage = req.file.path;
    }

    // UPDATE OTHER FIELDS
    user.name = name || user.name;
    user.phone = phone || "";
    user.location = location || "";
    user.bio = bio || "";
    user.language = language || "English";
    await user.save();

    res.json({
      message: "Profile updated",
      user,
    });
  } catch (error) {
    next(error);
  }
};
