import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import orderRoutes from "./routes/order.routes";
import { getServerUI } from "./services/server-ui";
import authRoutes from "./routes/auth.routes";
import User from "./models/User";

dotenv.config();

const requiredEnvVars = [
  "MONGODB_URI",
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
  "MANAGER_EMAIL",
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD",
];

for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    console.error(`❌ Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

const app = express();
app.use(cors());
app.use(express.json());

// Root route - Server UI
app.get("/", (_req, res) => {
  res.send(getServerUI());
});

// Routes
app.use("/api", orderRoutes); // This handles /api/orders and /api/admin/...
app.use("/api/admin", authRoutes); // This handles /api/admin/login

app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

const PORT = process.env.PORT || 5000;

const seedAdminUser = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL!;
    const adminPassword = process.env.ADMIN_PASSWORD!;

    const existingUser = await User.findOne({ email: adminEmail });
    if (!existingUser) {
      await User.create({
        email: adminEmail,
        password: adminPassword,
      });
      console.log("✅ Admin user seeded successfully");
    } else {
      // Update password if it changed in .env
      if (existingUser.password !== adminPassword) {
        existingUser.password = adminPassword;
        await existingUser.save();
        console.log("✅ Admin user password updated from .env");
      }
    }
  } catch (error) {
    console.error("❌ Error seeding admin user:", error);
  }
};

mongoose
  .connect(process.env.MONGODB_URI!)
  .then(async () => {
    console.log("✅ Connected to MongoDB");
    await seedAdminUser();
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
