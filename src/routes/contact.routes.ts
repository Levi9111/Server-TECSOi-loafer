import { Router } from "express";
import { body } from "express-validator";
import { handleContactForm } from "../controllers/contact.controller";
import { handleValidationErrors } from "../middleware/validate.order";

const router = Router();

const contactValidationRules = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("phone")
    .trim()
    .matches(/^01[3-9]\d{8}$/)
    .withMessage("Invalid Bangladeshi phone number"),
  body("message").trim().notEmpty().withMessage("Message is required"),
];

router.post("/", contactValidationRules, handleValidationErrors, handleContactForm);

export default router;
