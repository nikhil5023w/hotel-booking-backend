import express from "express";
import cors from "cors";

// Database
import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

// Middleware
import errorHandler from "./middleware/errorMiddleware.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import webhookRoutes from "./routes/webhookRoutes.js";
import availabilityRoutes from "./routes/availabilityRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import refundRoutes from "./routes/refundRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";


const app = express();

// =======================
// CONNECT DATABASE
// =======================
connectDB();
app.use("/api/webhook", webhookRoutes);

// =======================
// GLOBAL MIDDLEWARES
// =======================
app.use(cors());
app.use(express.json());

// =======================
// HEALTH CHECK ROUTE
// =======================
app.get("/", (req, res) => {
  res.send("API is running...");
});

// =======================
// API ROUTES
// =======================
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/refunds", refundRoutes);



// =======================
// ERROR HANDLER
// =======================
app.use(errorHandler);

export default app;
