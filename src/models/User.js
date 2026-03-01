// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },

//     email: { type: String, required: true, unique: true },

//     password: { type: String },

//     role: {
//       type: String,
//       enum: ["user", "admin"],
//       default: "user",
//     },

//     // PASSWORD RESET
//     resetPasswordToken: String,
//     resetPasswordExpire: Date,

//     // EMAIL VERIFICATION
//     isVerified: { type: Boolean, default: false },
//     verificationToken: String,
//     verificationExpire: Date,

//     // GOOGLE LOGIN
//     googleId: String,
//   },
//   { timestamps: true }
// );

// export default mongoose.model("User", userSchema);


import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // PROFILE DETAILS
    phone: { type: String, default: "" },
    location: { type: String, default: "" },
    bio: { type: String, default: "" },
    language: { type: String, default: "English" },
    profileImage: { type: String, default: "" },

    // PASSWORD RESET
    resetPasswordToken: String,
    resetPasswordExpire: Date,

    // EMAIL VERIFICATION
    isVerified: { type: Boolean, default: false },
    verificationToken: String,
    verificationExpire: Date,

    // GOOGLE LOGIN
    googleId: String,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);