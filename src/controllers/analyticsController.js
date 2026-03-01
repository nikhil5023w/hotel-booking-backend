import Booking from "../models/Booking.js";

export const getAnalytics = async (req, res, next) => {
  try {
    const bookings = await Booking.find();

    const totalBookings = bookings.length;

    const totalRevenue = bookings
      .filter((b) => b.status !== "cancelled")
      .reduce((sum, b) => sum + b.totalPrice, 0);

    const totalCancelled = bookings.filter(
      (b) => b.status === "cancelled"
    ).length;

    // Monthly stats
    const monthlyStats = {};

    bookings.forEach((b) => {
      const month = new Date(b.createdAt).toLocaleString("default", {
        month: "short",
      });

      if (!monthlyStats[month]) {
        monthlyStats[month] = { bookings: 0, revenue: 0 };
      }

      monthlyStats[month].bookings += 1;

      if (b.status !== "cancelled") {
        monthlyStats[month].revenue += b.totalPrice;
      }
    });

    res.json({
      totalBookings,
      totalRevenue,
      totalCancelled,
      monthlyStats,
    });
  } catch (error) {
    next(error);
  }
};
