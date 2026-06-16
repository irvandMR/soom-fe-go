export interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  productType?: "MADE_TO_ORDER" | "MADE_TO_STOCK" | "RESELL";
}

export interface Order {
  id: string;
  customerName: string;
  orderNumber: string;
  orderDate: string;
  status: "DONE" | "PENDING" | "CANCELLED";
  totalAmount: number;
  paymentStatus: "DP" | "LUNAS";
  dpAmount?: number;
  items?: OrderItem[];
  paymentMethod?: string;
  notes?: string;
  orderType?: "PRE_ORDER" | "DIRECT";
}
