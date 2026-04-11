import mongoose, { Schema, Document } from "mongoose";
import { IOrder } from "../types/order.types";

export interface IOrderDocument extends IOrder, Document {}

const OrderSchema = new Schema<IOrderDocument>(
  {
    fullName: { type: String, required: true },
    phone:    { type: String, required: true },
    address:  { type: String, required: true },
    city:     { type: String, required: true },
    note:     { type: String },
    payment:  { type: String, enum: ["cod", "bkash", "nagad"], required: true },
    items: [
      {
        name:     { type: String, required: true },
        size:     { type: Number },
        quantity: { type: Number, required: true },
        price:    { type: Number, required: true },
      },
    ],
    grandTotal: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IOrderDocument>("Order", OrderSchema);
