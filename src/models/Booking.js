import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },

    // ⭐ Save roomType snapshot
    roomType: {
      type: String,
      required: true,
    },

    checkInDate: {
      type: Date,
      required: true,
    },

    checkOutDate: {
      type: Date,
      required: true,
    },

    totalPrice: {
      type: Number,
      required: true,
    },
    guestDetails: {
      fullName: String,
      phone: String,
      email: String,
      age: Number,
      idProofUrl: String,

      // ⭐ NEW FIELD
      documentType: {
        type: String,
      },
    },

    // ⭐ Booking lifecycle
    status: {
      type: String,
      enum: ["pending", "paid", "confirmed", "cancelled"],
      default: "confirmed",
    },

    // ⭐ Needed for Stripe refund
    paymentIntentId: {
      type: String,
    },

    // ⭐ Refund tracking
    refundId: {
      type: String,
    },

    cancelledAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
