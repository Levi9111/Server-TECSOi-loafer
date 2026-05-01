import nodemailer from "nodemailer";
import { IOrderDocument } from "../models/Order";

// Strip any stray quotes from environment values (common dotenv issue)
const cleanEnv = (val: string | undefined) => val?.replace(/^['"]|['"]$/g, "").trim() || "";

// Create transporter lazily to ensure env vars are loaded
let transporter: nodemailer.Transporter | null = null;

const getTransporter = () => {
  if (!transporter) {
    const smtpUser = cleanEnv(process.env.SMTP_USER);
    const smtpPass = cleanEnv(process.env.SMTP_PASS);

    console.log(`[EMAIL] Configuring SMTP: host=${process.env.SMTP_HOST}, port=${process.env.SMTP_PORT}, user=${smtpUser}`);

    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Verify connection on first creation
    transporter.verify((error, _success) => {
      if (error) {
        console.error("[EMAIL] SMTP connection verification failed:", error.message);
      } else {
        console.log("[EMAIL] ✅ SMTP connection verified successfully");
      }
    });
  }
  return transporter;
};

const getRecipients = () => {
  const emails = [process.env.MANAGER_EMAIL, process.env.MANAGER_EMAIL2, process.env.MANAGER_EMAIL3];
  return emails
    .filter(Boolean)
    .flatMap((email) => email!.split(",").map((e) => e.trim()))
    .filter((email) => email.length > 0);
};

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

  const recipients = getRecipients();

  await getTransporter().sendMail({
    from: `"TEKSOi Leather" <${cleanEnv(process.env.SMTP_USER)}>`,
    to: recipients,
    subject: `New Order from ${order.fullName} — ৳${order.grandTotal.toLocaleString()}`,
    html,
  });
};

export const sendContactEmail = async (data: { name: string; phone: string; message: string }) => {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
      <h2 style="color:#2c2c2c">📩 New Contact Message — TEKSOi Leather</h2>
      <hr/>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Message:</strong></p>
      <p style="white-space:pre-wrap;background:#f9f9f9;padding:15px;border-radius:5px">${data.message}</p>
      <hr/>
      <p style="color:#888;font-size:12px">This email was sent from the contact form on the TEKSOi Leather website.</p>
    </div>
  `;

  const recipients = getRecipients();

  await getTransporter().sendMail({
    from: `"TEKSOi Leather Contact" <${cleanEnv(process.env.SMTP_USER)}>`,
    to: recipients,
    subject: `New Message from ${data.name}`,
    html,
  });
};
