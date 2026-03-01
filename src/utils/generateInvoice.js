import PDFDocument from "pdfkit";

export const generateInvoice = (booking, room, user, res) => {
  const doc = new PDFDocument();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=invoice-${booking._id}.pdf`
  );

  doc.pipe(res);

  doc.fontSize(20).text("Hotel Booking Invoice", { align: "center" });

  doc.moveDown();

  doc.fontSize(12).text(`Invoice ID: ${booking._id}`);
  doc.text(`Customer: ${user.name}`);
  doc.text(`Email: ${user.email}`);

  doc.moveDown();

  doc.text(`Room: ${room.name}`);
  doc.text(`Check-In: ${new Date(booking.checkInDate).toDateString()}`);
  doc.text(`Check-Out: ${new Date(booking.checkOutDate).toDateString()}`);
  doc.text(`Total Price: £${booking.totalPrice}`);

  doc.moveDown();
  doc.text("Thank you for your booking!", { align: "center" });

  doc.end();
};
