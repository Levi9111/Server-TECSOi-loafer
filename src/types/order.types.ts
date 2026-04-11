export interface IOrderItem {
  name: string;
  size?: number;
  quantity: number;
  price: number;
}

export interface IOrder {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  note?: string;
  payment: "cod" | "bkash" | "nagad";
  items: IOrderItem[];
  grandTotal: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}
