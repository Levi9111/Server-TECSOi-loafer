import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const orderValidationRules = [
  body("fullName")
    .trim()
    .notEmpty().withMessage("Full name is required"),

  body("phone")
    .trim()
    .matches(/^01[3-9]\d{8}$/).withMessage("Invalid Bangladeshi phone number"),

  body("address")
    .trim()
    .notEmpty().withMessage("Address is required"),

  body("city")
    .trim()
    .notEmpty().withMessage("City is required"),

  body("payment")
    .isIn(["cod", "bkash", "nagad"]).withMessage("Payment must be cod, bkash, or nagad"),

  body("items")
    .isArray({ min: 1 }).withMessage("Order must contain at least one item"),

  body("items.*.name")
    .trim()
    .notEmpty().withMessage("Each item must have a name"),

  body("items.*.quantity")
    .isInt({ min: 1 }).withMessage("Item quantity must be at least 1"),

  body("items.*.price")
    .isFloat({ min: 0.01 }).withMessage("Item price must be greater than 0"),
];

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};
