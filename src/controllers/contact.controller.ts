import { Request, Response } from "express";
import { sendContactEmail } from "../services/email.service";

export const handleContactForm = async (req: Request, res: Response) => {
  try {
    const { name, phone, message } = req.body;

    await sendContactEmail({ name, phone, message });

    res.status(200).json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("❌ Error sending contact email:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message. Please try again later.",
    });
  }
};
