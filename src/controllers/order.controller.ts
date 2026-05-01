import { Request, Response } from "express";
import Order from "../models/Order";
import { sendOrderEmail } from "../services/email.service";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { fullName, phone, address, city, note, payment, items, deliveryZone } = req.body;

    const subtotal = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    );
    const deliveryFee = deliveryZone === "outside" ? 120 : 70;
    const grandTotal = subtotal + deliveryFee;

    const order = await Order.create({
      fullName,
      phone,
      address,
      city,
      note,
      payment,
      items,
      grandTotal,
    });

    console.log(`[ORDER] New order created: ${order._id} — ${order.fullName} — ৳${order.grandTotal}`);

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      orderId: order._id,
    });

    sendOrderEmail(order).catch((err) => {
      console.error(`[EMAIL] Failed for order ${order._id}:`, err.message);
    });

  } catch (error) {
    console.error("[ORDER] Order creation failed:", error);
    res.status(500).json({ success: false, message: "Failed to place order" });
  }
};

export const getOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("[ORDER] Fetch failed:", error);
    res.status(500).json({ success: false, message: "Failed to fetch order" });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    const query: any = {};

    if (status && status !== "all") {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      orders,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("[ORDER] Fetch all failed:", error);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("[ORDER] Update status failed:", error);
    res.status(500).json({ success: false, message: "Failed to update order status" });
  }
};

export const getDashboardStats = async (_req: Request, res: Response) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: "pending" });
    const deliveredOrders = await Order.countDocuments({ status: "delivered" });
    
    // Calculate total revenue from delivered orders
    const deliveredOrdersList = await Order.find({ status: "delivered" });
    const totalRevenue = deliveredOrdersList.reduce((sum, order) => sum + order.grandTotal, 0);

    res.status(200).json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        deliveredOrders,
        totalRevenue,
      },
    });
  } catch (error) {
    console.error("[ORDER] Stats failed:", error);
    res.status(500).json({ success: false, message: "Failed to fetch dashboard stats" });
  }
};
