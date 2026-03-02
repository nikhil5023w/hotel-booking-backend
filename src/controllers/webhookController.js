import Stripe from "stripe";
import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import User from "../models/User.js";
import { bookingConfirmationTemplate } from "../utils/emailTemplates.js";
import { sendEmail } from "../utils/sendEmail.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error("Webhook signature error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // ⭐ HANDLE PAYMENT SUCCESS
  if (event.type === "checkout.session.completed") {
    try {
      const session = event.data.object;
      // 🚨 Prevent duplicate bookings
      const existingBooking = await Booking.findOne({
        paymentIntentId: session.payment_intent,
      });

      if (existingBooking) {
        console.log("⚠️ Duplicate webhook ignored:", session.payment_intent);
        return res.json({ received: true });
      }

      const {
        roomId,
        checkInDate,
        checkOutDate,
        userId,
        fullName,
        phone,
        email,
        age,
        idProofUrl,
        documentType, // ⭐ NEW
      } = session.metadata;

      const room = await Room.findById(roomId);

      if (!room) {
        console.error("Room not found:", roomId);
        return res.json({ received: true });
      }
      const days =
        (new Date(checkOutDate) - new Date(checkInDate)) /
        (1000 * 60 * 60 * 24);

      const totalPrice = days * room.price;
      // 🚨 Prevent double booking
      const overlappingBooking = await Booking.findOne({
        room: roomId,
        status: "confirmed",
        $or: [
          {
            checkInDate: { $lt: new Date(checkOutDate) },
            checkOutDate: { $gt: new Date(checkInDate) },
          },
        ],
      });

      if (overlappingBooking) {
        console.log("⚠️ Room already booked for these dates");
        return res.json({ received: true });
      }

      // ⭐ CREATE BOOKING WITH GUEST DETAILS
      await Booking.create({
        user: userId,
        room: roomId,
        roomType: room.roomType, // ⭐ ADD THIS

        checkInDate,
        checkOutDate,
        totalPrice,
        paymentIntentId: session.payment_intent,
        stripeSessionId: session.id,
        status: "confirmed",

        guestDetails: {
          fullName,
          phone,
          email,
          age,
          idProofUrl,
          documentType,
        },
      });

      console.log("✅ Booking created via webhook");

      // ⭐ GET USER
      const user = await User.findById(userId);

      // ⭐ SEND EMAIL
      const html = bookingConfirmationTemplate({
        name: user.name,
        room: room.name,
        checkIn: new Date(checkInDate).toDateString(),
        checkOut: new Date(checkOutDate).toDateString(),
        total: totalPrice,
      });

      await sendEmail(user.email, "Booking Confirmation", html);

      console.log("📧 Email sent successfully");
    } catch (error) {
      console.error("Webhook processing error:", error);
    }
  }

  res.json({ received: true });
};
