import { getStripe } from "../config/stripe.js";
import Room from "../models/Room.js";

export const createCheckoutSession = async (req, res) => {
  try {
    console.log("USER FROM TOKEN:", req.user);
    console.log("------ PAYMENT REQUEST ------");
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    console.log("USER:", req.user);
    console.log("HEADERS:", req.headers.authorization);
    console.log("CLIENT_URL:", process.env.CLIENT_URL);
    console.log(
      "STRIPE_KEY:",
      process.env.STRIPE_SECRET_KEY ? "Loaded" : "Missing",
    );
    const {
      roomId,
      checkInDate,
      checkOutDate,
      fullName,
      phone,
      email,
      age,
      documentType, // ⭐ NEW
    } = req.body;
    // ⭐ Validate required fields
    if (!roomId || !checkInDate || !checkOutDate) {
      return res.status(400).json({ message: "Missing booking details" });
    }
    console.log("ROOM ID:", roomId);
    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // ⭐ Get uploaded ID proof URL from Cloudinary
    const idProofUrl = req.file?.path || "";

    // ⭐ Calculate stay duration
    const days =
      (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24);

    if (days <= 0) {
      return res.status(400).json({ message: "Invalid date selection" });
    }

    const totalPrice = days * (room.price || 0);
    const stripe = getStripe();
    if (!stripe) {
      throw new Error("Stripe not initialized");
    }
    if (!req.user) {
      return res.status(401).json({ message: "User authentication failed" });
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: "gbp", // ⭐ Stripe currency (UK client)
            product_data: {
              name: room.name,
              description: room.description,
            },
            unit_amount: Math.round(totalPrice * 100), // pence
          },
          quantity: 1,
        },
      ],

      mode: "payment",

      // ⭐ Pass guest details to webhook
      metadata: {
        roomId,
        checkInDate,
        checkOutDate,
        userId: req.user?._id?.toString() || "",
        fullName: fullName || "",
        phone: phone || "",
        email: email || "",
        age: age || "",
        idProofUrl: idProofUrl || "",
        documentType: documentType || "", // ⭐ NEW
      },

      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error FULL:", error);
    console.error("Checkout error MESSAGE:", error.message);
    console.error("Checkout error STACK:", error.stack);
    res.status(500).json({
      message: error.message,
      stack: error.stack,
    });
  }
};
