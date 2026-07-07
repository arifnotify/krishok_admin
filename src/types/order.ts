export type OrderStatus =
  | "Pending"
  | "Processing"
  | "OutForDelivery"
  | "Delivered"
  | "Cancelled";

// =========================
// ADDRESS TYPE (NEW IMPORTANT)
// =========================
export interface Address {
  _id?: string;
  fullName?: string;
  phoneNumber?: string;
  areaOrVillage?: string;
  landmark?: string;
  directionNote?: string;
  latitude?: number;
  longitude?: number;
  label?: string;
}

// =========================
// ORDER ITEM
// =========================
export interface OrderItem {
  product?: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

// =========================
// ORDER TYPE (FIXED)
// =========================
export interface Order {
  _id: string;
  orderNumber: string;
  customerPhone: string;

  // 🔥 FIXED (was string, now object)
  shippingAddress: Address;

  items: OrderItem[];

  totalAmount: number;
  paymentMethod: string;
  orderStatus: OrderStatus;
  isPaid: boolean;

  assignedRider?: string | null;
  trackingEnabled: boolean;

  riderLat?: number | null;
  riderLng?: number | null;
  lastLocationUpdate?: string | null;

  createdAt: string;
  updatedAt: string;
}