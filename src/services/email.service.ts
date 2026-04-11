import nodemailer from "nodemailer";
import { IOrderDocument } from "../models/Order";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendOrderEmail = async (order: IOrderDocument) => {
  const itemRows = order.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px;border:1px solid #ddd">${item.name}</td>
          <td style="padding:8px;border:1px solid #ddd">${item.size ?? "N/A"}</td>
          <td style="padding:8px;border:1px solid #ddd">${item.quantity}</td>
          <td style="padding:8px;border:1px solid #ddd">৳${(item.price * item.quantity).toLocaleString()}</td>
        </tr>`
    )
    .join("");

  const paymentLabel =
    order.payment === "cod"
      ? "Cash on Delivery"
      : order.payment === "bkash"
      ? "bKash"
      : "Nagad";

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
      <h2 style="color:#2c2c2c">🛒 New Order Received — TEKSOi Leather</h2>
      <hr/>
      <h3>Customer Details</h3>
      <p><strong>Name:</strong> ${order.fullName}</p>
      <p><strong>Phone:</strong> ${order.phone}</p>
      <p><strong>Address:</strong> ${order.address}, ${order.city}</p>
      <p><strong>Payment:</strong> ${paymentLabel}</p>
      ${order.note ? `<p><strong>Note:</strong> ${order.note}</p>` : ""}

      <h3>Order Items</h3>
      <table style="width:100%;border-collapse:collapse">
        <thead>
          <tr style="background:#f5f5f5">
            <th style="padding:8px;border:1px solid #ddd;text-align:left">Product</th>
            <th style="padding:8px;border:1px solid #ddd;text-align:left">Size</th>
            <th style="padding:8px;border:1px solid #ddd;text-align:left">Qty</th>
            <th style="padding:8px;border:1px solid #ddd;text-align:left">Total</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>

      <h3 style="margin-top:16px">Grand Total: ৳${order.grandTotal.toLocaleString()}</h3>
      <hr/>
      <p style="color:#888;font-size:12px">Order ID: ${order._id}</p>
      <p style="color:#888;font-size:12px">This email was sent automatically by the TEKSOi Leather ordering system.</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"TEKSOi Leather" <${process.env.SMTP_USER}>`,
    to: process.env.MANAGER_EMAIL,
    subject: `New Order from ${order.fullName} — ৳${order.grandTotal.toLocaleString()}`,
    html,
  });
};
