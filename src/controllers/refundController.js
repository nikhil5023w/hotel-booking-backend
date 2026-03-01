import Stripe from "stripe";
import Booking from "../models/Booking.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const cancelBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status !== "paid" && booking.status !== "confirmed") {
      return res.status(400).json({ message: "Booking cannot be cancelled" });
    }

    const today = new Date();
    if (new Date(booking.checkInDate) <= today) {
      return res.status(400).json({ message: "Cannot cancel after check-in" });
    }

    // Refund via Stripe
    const refund = await stripe.refunds.create({
      payment_intent: booking.paymentIntentId,
    });

    booking.status = "cancelled";
    booking.refundId = refund.id;
    booking.cancelledAt = new Date();

    await booking.save();

    res.json({ message: "Booking cancelled & refunded" });
  } catch (error) {
    next(error);
  }
};
