import Stripe from "stripe";
import Booking from "../models/Booking.js";
import User from "../models/User.js";
import Room from "../models/Room.js";
import { sendEmail } from "../utils/sendEmail.js";
import { cancellationTemplate } from "../utils/emailTemplates.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// CREATE BOOKING
export const createBooking = async (req, res, next) => {
  try {
    const { roomId, checkInDate, checkOutDate } = req.body;

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });

    // Check overlapping bookings
    const existingBooking = await Booking.findOne({
      room: roomId,
      status: "confirmed",
      $or: [
        {
          checkInDate: { $lt: checkOutDate },
          checkOutDate: { $gt: checkInDate },
        },
      ],
    });

    if (existingBooking) {
      return res
        .status(400)
        .json({ message: "Room already booked for these dates" });
    }

    const days =
      (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24);

    const totalPrice = days * room.price;

    const booking = await Booking.create({
      user: req.user._id,
      room: roomId,
      checkInDate,
      checkOutDate,
      totalPrice,
    });

    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
};

// GET USER BOOKINGS
export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate(
      "room",
    );
    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

// GET ALL BOOKINGS (ADMIN)
export const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("room");

    res.json(bookings);
  } catch (error) {
    next(error);
  }
};


// get last details of guest 
export const getLastGuestDetails = async (req, res, next) => {
  try {
    const lastBooking = await Booking.findOne({ user: req.user._id })
      .sort({ createdAt: -1 });

    if (!lastBooking || !lastBooking.guestDetails) {
      return res.json(null);
    }

    res.json(lastBooking.guestDetails);
  } catch (error) {
    next(error);
  }
};


// CANCEL BOOKING
export const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking already cancelled" });
    }

    if (new Date(booking.checkInDate) <= new Date()) {
      return res
        .status(400)
        .json({ message: "Cannot cancel after check-in date" });
    }

    // Refund via Stripe
    if (booking.paymentIntentId) {
      const refund = await stripe.refunds.create({
        payment_intent: booking.paymentIntentId,
      });

      booking.refundId = refund.id;
    }

    booking.status = "cancelled";
    booking.cancelledAt = new Date();

    await booking.save();

    // ⭐ Fetch user + room for email
    const user = await User.findById(booking.user);
    const room = await Room.findById(booking.room);

    // ⭐ Send cancellation email
    const html = cancellationTemplate({
      name: user.name,
      room: room.name,
      checkIn: booking.checkInDate.toDateString(),
      checkOut: booking.checkOutDate.toDateString(),
      total: booking.totalPrice,
    });

    await sendEmail(user.email, "Booking Cancelled", html);

    res.json({ message: "Booking cancelled, refunded & email sent" });
  } catch (error) {
    next(error);
  }
};
