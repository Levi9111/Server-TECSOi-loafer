import { Router } from "express";
import { createOrder, getOrder, getAllOrders, updateOrderStatus, getDashboardStats } from "../controllers/order.controller";
import { orderValidationRules, handleValidationErrors } from "../middleware/validate.order";

const router = Router();

router.post("/orders", orderValidationRules, handleValidationErrors, createOrder);
router.get("/:id", getOrder);

// Admin routes
router.get("/admin/orders", getAllOrders);
router.get("/admin/orders/:id", getOrder);
router.patch("/admin/orders/:id/status", updateOrderStatus);
router.get("/admin/stats", getDashboardStats);

export default router;
