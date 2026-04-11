import { Request, Response } from "express";
import User from "../models/User";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // Simple logic: return success and a dummy token as JWT is not needed right now
    res.status(200).json({
      success: true,
      message: "Login successful",
      token: "dummy-admin-token",
    });
  } catch (error) {
    console.error("[AUTH] Login failed:", error);
    res.status(500).json({ success: false, message: "Login failed" });
  }
};
