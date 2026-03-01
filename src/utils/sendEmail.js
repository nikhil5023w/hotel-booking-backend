import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ⭐ Generic email sender
export const sendEmail = async (to, subject, html) => {
  await transporter.sendMail({
    from: `"Hotel Booking" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

// ⭐ Booking confirmation email (existing feature)
export const sendBookingEmail = async (to, subject, html) => {
  await sendEmail(to, subject, html);
};
