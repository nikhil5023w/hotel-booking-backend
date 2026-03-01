export const bookingConfirmationTemplate = ({
  name,
  room,
  checkIn,
  checkOut,
  total,
}) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; background:#f4f6f8;">
      <h2 style="color:#2563eb;">Booking Confirmed 🎉</h2>

      <div style="background:white; padding:15px; border-radius:8px;">
        <p><strong>Guest:</strong> ${name}</p>
        <p><strong>Room:</strong> ${room}</p>
        <p><strong>Check-In:</strong> ${checkIn}</p>
        <p><strong>Check-Out:</strong> ${checkOut}</p>
        <p><strong>Total:</strong> £${total}</p>
      </div>

      <p style="margin-top:15px;">Thank you for choosing us!</p>
      <p style="color:gray;">Hotel Booking Team</p>
    </div>
  `;
};

export const cancellationTemplate = ({
  name,
  room,
  checkIn,
  checkOut,
  total,
}) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; background:#f4f6f8;">
      <h2 style="color:#dc2626;">Booking Cancelled</h2>

      <div style="background:white; padding:15px; border-radius:8px;">
        <p><strong>Guest:</strong> ${name}</p>
        <p><strong>Room:</strong> ${room}</p>
        <p><strong>Check-In:</strong> ${checkIn}</p>
        <p><strong>Check-Out:</strong> ${checkOut}</p>
        <p><strong>Refund Amount:</strong> £${total}</p>
      </div>

      <p style="margin-top:15px;">We hope to see you again soon.</p>
      <p style="color:gray;">Hotel Booking Team</p>
    </div>
  `;
};
