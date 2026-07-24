// =========================
// ORDER STATUS
// =========================
export type OrderStatus =
  | "Pending"
  | "Processing"
  | "OutForDelivery"
  | "Delivered"
  | "Cancelled";

// =========================
// ADDRESS TYPE
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

  productName:
    | {
        en: string;
        bn?: string;
      }
    | string;

  unit?: string;

  productImage: string;

  quantity: number;

  price: number;

  totalPrice: number;
}

// =========================
// ORDER
// =========================
export interface Order {
  _id: string;

  orderNumber: string;

  user: string;

  customerPhone: string;

  shippingAddress: Address;

  items: OrderItem[];

  // =========================
  // PRICE
  // =========================
  subTotal: number;

  deliveryCharge: number;

  rewardUsed?: number;

  discountAmount?: number;

  totalAmount: number;

  finalAmount: number;

  // =========================
  // PAYMENT
  // =========================
  paymentMethod: string;

  payment?: any;

  isPaid: boolean;

  // =========================
  // STATUS
  // =========================
  orderStatus: OrderStatus;

  // =========================
  // RIDER
  // =========================
assignedRider?: {
  _id: string;
  name?: string;
  phone?: string;
} | null;

  trackingEnabled: boolean;

  riderLat?: number | null;

  riderLng?: number | null;

  lastLocationUpdate?: string | null;

  // =========================
  // TIME
  // =========================
  createdAt: string;

  updatedAt: string;
}
