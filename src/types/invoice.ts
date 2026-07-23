export interface InvoiceItem {
  productName: string;
  productNameBn?: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

export interface InvoiceCustomer {
  name?: string;
  phone: string;
  address: string;
}

export interface InvoiceData {
  invoiceNumber: string;
  orderNumber: string;
  invoiceDate: string;
  customer: InvoiceCustomer;
  items: InvoiceItem[];
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  total: number;
  paymentMethod: string;
  paymentStatus: boolean;
  orderStatus: string;
}
