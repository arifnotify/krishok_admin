import { InvoiceData, InvoiceItem } from "@/src/types/invoice";
import { COMPANY } from "../components/company";
import { formatCurrency } from "./currency";

export const printReceipt = (invoice: InvoiceData) => {
  const printWindow = window.open("", "_blank", "width=400,height=800");

  if (!printWindow) {
    alert("Popup blocked! Please allow popups for this site.");
    return;
  }

  // ===============================
  // REAL-TIME TOTAL CALCULATIONS
  // ===============================
  const subtotal = Number(invoice.subtotal || 0);
  const deliveryCharge = Number(invoice.deliveryCharge || 0);
  const discount = Number(invoice.discount || 0);
  const grandTotal = Number(invoice.total ?? subtotal + deliveryCharge - discount);

  const totalItems = (invoice.items || []).reduce(
    (sum: number, item: InvoiceItem) => sum + (item.quantity || 0),
    0
  );

  // ===============================
  // ITEMS HTML GENERATION
  // ===============================
  const itemsHTML = (invoice.items || [])
    .map(
      (item: InvoiceItem) => `
      <div class="item">
        <div class="item-row">
          <div class="product">
            <div class="en">
              ${item.quantity} × ${item.productName || "Product"}
            </div>
            ${
              item.productNameBn
                ? `<div class="bn">${item.productNameBn}</div>`
                : ""
            }
          </div>
          <div class="price">
            ${formatCurrency(item.totalPrice || item.price * item.quantity)}
          </div>
        </div>
      </div>
    `
    )
    .join("");

  printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Receipt - #${invoice.orderNumber}</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      width: 80mm;
      margin: auto;
      padding: 10px;
      font-family: Arial, "Noto Sans Bengali", sans-serif;
      color: #000;
      background: #fff;
    }

    .center { text-align: center; }
    .company { font-size: 22px; font-weight: 800; text-transform: uppercase; }
    .small { font-size: 11px; color: #333; }
    
    .line {
      border-top: 1px dashed #000;
      margin: 10px 0;
    }

    .order-title { font-size: 12px; font-weight: bold; letter-spacing: 1px; }
    .order-number { font-size: 36px; font-weight: 900; letter-spacing: 2px; margin-top: 2px; }

    .customer { font-size: 13px; line-height: 1.5; }

    .item { margin-bottom: 8px; }
    .item-row { display: flex; justify-content: space-between; gap: 8px; }
    .product { width: 70%; }
    .en { font-size: 13px; font-weight: 700; word-break: break-word; }
    .bn { font-size: 12px; margin-top: 2px; color: #444; }
    .price { font-size: 13px; font-weight: 700; white-space: nowrap; text-align: right; }

    .summary { font-size: 14px; }
    .row { display: flex; justify-content: space-between; margin-bottom: 6px; }

    .total {
      display: flex;
      justify-content: space-between;
      font-size: 20px;
      font-weight: 900;
      border-top: 1px dashed #000;
      padding-top: 8px;
      margin-top: 8px;
    }

    .payment { text-align: center; margin-top: 12px; }
    .payment-method { font-size: 18px; font-weight: bold; text-transform: uppercase; }

    .thanks { text-align: center; margin-top: 16px; font-size: 20px; font-weight: 800; }
    .footer { text-align: center; font-size: 11px; margin-top: 10px; line-height: 1.4; }

    @media print {
      body { width: 80mm; padding: 0; }
      @page { margin: 0; }
    }
  </style>
</head>
<body>

  <div class="center">
    <div class="company">${COMPANY.name}</div>
    <div class="small">Delivery Receipt</div>
    <div class="small">${new Date(invoice.invoiceDate || Date.now()).toLocaleString()}</div>
  </div>

  <div class="line"></div>

  <div class="center">
    <div class="order-title">ORDER NUMBER</div>
    <div class="order-number">#${invoice.orderNumber}</div>
  </div>

  <div class="line"></div>

  <div class="customer">
    <b>Customer:</b> ${invoice.customer?.name || "Customer"}<br/>
    <b>Phone:</b> ${invoice.customer?.phone || "N/A"}<br/>
    <b>Address:</b> ${invoice.customer?.address || "N/A"}
  </div>

  <div class="line"></div>

  ${itemsHTML}

  <div class="line"></div>

  <div class="summary">
    <div class="row">
      <span>Total Items</span>
      <span>${totalItems}</span>
    </div>

    <div class="row">
      <span>Subtotal</span>
      <span>${formatCurrency(subtotal)}</span>
    </div>

    <div class="row">
      <span>Delivery Fee</span>
      <span>${formatCurrency(deliveryCharge)}</span>
    </div>

    ${
      discount > 0
        ? `
    <div class="row">
      <span>Discount</span>
      <span>- ${formatCurrency(discount)}</span>
    </div>
    `
        : ""
    }

    <div class="total">
      <span>TOTAL</span>
      <span>${formatCurrency(grandTotal)}</span>
    </div>
  </div>

  <div class="line"></div>

  <div class="payment">
    <div class="small">Payment Method</div>
    <div class="payment-method">${invoice.paymentMethod || "CASH ON DELIVERY"}</div>
  </div>

  <div class="thanks">Thank You ❤️</div>

  <div class="footer">
    ${COMPANY.address}<br/>
    ${COMPANY.phone}
  </div>

  <script>
    window.onload = function() {
      setTimeout(() => {
        window.print();
      }, 300);
    };

    window.onafterprint = function() {
      window.close();
    };
  </script>

</body>
</html>
  `);

  printWindow.document.close();
};
