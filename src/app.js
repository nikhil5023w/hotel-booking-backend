import express from "express";
import cors from "cors";

// Database
import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import webhookRoutes from "./routes/webhookRoutes.js";
import availabilityRoutes from "./routes/availabilityRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import refundRoutes from "./routes/refundRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

// Middleware
import errorHandler from "./middleware/errorMiddleware.js";

const app = express();

// =======================
// CONNECT DATABASE
// =======================
connectDB();

// =======================
// REQUEST LOGGER
// =======================
app.use((req, res, next) => {
  console.log("----- INCOMING REQUEST -----");
  console.log("METHOD:", req.method);
  console.log("URL:", req.originalUrl);
  console.log("HEADERS:", req.headers["content-type"]);
  next();
});

// =======================
// CORS CONFIG
// =======================
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://hotelbooking-murex-one.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.options("*", cors());

// =======================
// BODY PARSERS
// =======================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =======================
// STRIPE WEBHOOK
// (must be before json middleware in real production)
// =======================
app.use("/api/webhook", webhookRoutes);

// =======================
// HEALTH CHECK
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
// GLOBAL ERROR HANDLER
// =======================
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);

  res.status(err.status || 500).json({
    message: err.message || "Server Error",
    stack: err.stack,
  });
});

// =======================
// CUSTOM ERROR MIDDLEWARE
// =======================
app.use(errorHandler);

export default app;