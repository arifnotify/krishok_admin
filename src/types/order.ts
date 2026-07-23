export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

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
  productName: {
    en: string;
    bn?: string;
  } | string;
  unit?: string;
  productImage: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

// =========================
// ORDER TYPE (FULLY ACCURATE WITH NESTJS)
// =========================
export interface Order {
  _id: string;
  orderNumber: string;
  user: string;
  customerPhone: string;

  shippingAddress: Address;

  items: OrderItem[];

  // 💰 Price Calculation Fields (NestJS Schema এর সাথে শতভাগ মিল রাখা হয়েছে)
  subTotal: number;          // পণ্যের মোট দাম (price * quantity)
  deliveryCharge: number;     // ডেলিভারি চার্জ
  rewardUsed?: number;        // ব্যবহৃত রিওয়ার্ড পয়েন্ট
  discountAmount?: number;    // ডিসকাউন্ট বা রিওয়ার্ড অ্যামাউন্ট
  totalAmount: number;       // (subTotal + deliveryCharge)
  finalAmount: number;       // আসল ক্যাশ পেমেন্ট বা পরিশোধযোগ্য টাকা (totalAmount - rewardUsed)

  paymentMethod: string;
  payment?: any;
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
