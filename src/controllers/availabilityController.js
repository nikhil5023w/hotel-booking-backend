import Booking from "../models/Booking.js";

export const getRoomAvailability = async (req, res, next) => {
  try {
    const { roomId } = req.params;

    const bookings = await Booking.find({
      room: roomId,
      status: { $in: ["paid", "confirmed"] },
    }).select("checkInDate checkOutDate");

    const bookedRanges = bookings.map((b) => ({
      checkIn: b.checkInDate,
      checkOut: b.checkOutDate,
    }));

    res.json(bookedRanges);
  } catch (error) {
    next(error);
  }
};
