import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import User from "../models/User.js";
import { generateInvoice } from "../utils/generateInvoice.js";

export const downloadInvoice = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const room = await Room.findById(booking.room);
    const user = await User.findById(booking.user);

    generateInvoice(booking, room, user, res);
  } catch (error) {
    next(error);
  }
};
