import { InvoiceData } from "@/src/types/invoice";
import { COMPANY } from "../components/company";
import { formatCurrency } from "./currency";

export const printReceipt = (invoice: InvoiceData) => {
  const printWindow = window.open(
    "",
    "_blank",
    "width=420,height=900"
  );

  if (!printWindow) {
    alert("Popup blocked. Please allow popup.");
    return;
  }

  const totalItems = invoice.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const itemsHtml = invoice.items
    .map(
      (item) => `
      <div class="item">

        <div class="item-header">

          <div class="item-name">
            ${item.quantity} × ${item.productName}
          </div>

          <div class="item-price">
            ${formatCurrency(item.totalPrice)}
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

<meta charset="utf-8"/>

<title>Receipt</title>

<style>

*{
  margin:0;
  padding:0;
  box-sizing:border-box;
}

body{
  font-family: Arial, Helvetica, sans-serif;
  width:80mm;
  margin:0 auto;
  padding:10px;
  color:#000;
  background:#fff;
}

.receipt{
  width:100%;
}

.center{
  text-align:center;
}

.logo{
  font-size:32px;
  font-weight:800;
  letter-spacing:1px;
  margin-bottom:6px;
}

.company-name{
  font-size:15px;
  font-weight:600;
}

.delivery-text{
  margin-top:4px;
  font-size:15px;
}

.date{
  margin-top:10px;
  font-size:13px;
}

.separator{
  border-top:1px dashed #999;
  margin:14px 0;
}

.order-title{
  font-size:18px;
  font-weight:600;
}

.order-number{
  font-size:50px;
  font-weight:800;
  letter-spacing:3px;
  margin-top:10px;
  line-height:1;
}

.customer{
  font-size:15px;
  line-height:1.8;
}

.customer-row{
  display:flex;
  justify-content:space-between;
  gap:10px;
}

.customer-label{
  font-weight:700;
}

.items{
  margin-top:5px;
}

.item{
  margin-bottom:12px;
}

.item-header{
  display:flex;
  justify-content:space-between;
  align-items:flex-start;
  gap:10px;
}

.item-name{
  flex:1;
  font-size:15px;
  font-weight:600;
  line-height:1.3;
}

.item-price{
  font-size:15px;
  font-weight:700;
  white-space:nowrap;
}

.summary{
  margin-top:10px;
}

.summary-row{
  display:flex;
  justify-content:space-between;
  margin-bottom:10px;
  font-size:17px;
}

.total{
  display:flex;
  justify-content:space-between;
  margin-top:12px;
  font-size:24px;
  font-weight:800;
}

.payment{
  text-align:center;
  margin-top:18px;
}

.payment-label{
  font-size:14px;
}

.payment-method{
  font-size:24px;
  font-weight:700;
  margin-top:8px;
}

.thank-you{
  text-align:center;
  margin-top:20px;
}

.thank-you-text{
  font-size:30px;
  font-weight:800;
}

.footer{
  text-align:center;
  margin-top:12px;
  font-size:13px;
}

.address{
  margin-top:8px;
  font-size:12px;
  line-height:1.5;
}

.phone{
  margin-top:5px;
  font-size:12px;
}

@media print{

  html,
  body{
    width:80mm;
  }

}

</style>

</head>

<body>

<div class="receipt">

  <div class="center">

    <div class="logo">
      ${COMPANY.name}
    </div>

    <div class="company-name">
      Delivery Order
    </div>

    <div class="date">
      ${new Date().toLocaleString()}
    </div>

  </div>

  <div class="separator"></div>

  <div class="center">

    <div class="order-title">
      Order Number
    </div>

    <div class="order-number">
      ${invoice.orderNumber}
    </div>

  </div>

  <div class="separator"></div>

  <div class="customer">

    <div class="customer-row">
      <span class="customer-label">Customer:</span>
      <span>${invoice.customer.name}</span>
    </div>

    <div class="customer-row">
      <span class="customer-label">Phone:</span>
      <span>${invoice.customer.phone}</span>
    </div>

    <div style="margin-top:8px;">
      <span class="customer-label">Address:</span>
      <br/>
      ${invoice.customer.address}
    </div>

  </div>

  <div class="separator"></div>

  <div class="items">

    ${itemsHtml}

  </div>

  <div class="separator"></div>

  <div class="summary">

    <div class="summary-row">
      <span>Subtotal</span>
      <span>${formatCurrency(invoice.subtotal)}</span>
    </div>

    <div class="summary-row">
      <span>Delivery Fee</span>
      <span>${formatCurrency(invoice.deliveryCharge)}</span>
    </div>

    ${
      invoice.discount > 0
        ? `
        <div class="summary-row">
          <span>Discount</span>
          <span>-${formatCurrency(invoice.discount)}</span>
        </div>
      `
        : ""
    }

    <div class="total">
      <span>Total (${totalItems})</span>
      <span>${formatCurrency(invoice.total)}</span>
    </div>

  </div>

  <div class="separator"></div>

  <div class="payment">

    <div class="payment-label">
      Payment Method
    </div>

    <div class="payment-method">
      ${invoice.paymentMethod}
    </div>

  </div>

  <div class="thank-you">

    <div class="thank-you-text">
      Thank You!
    </div>

  </div>

  <div class="footer">

    <div class="address">
      ${COMPANY.address}
    </div>

    <div class="phone">
      ${COMPANY.phone}
    </div>

  </div>

</div>

<script>

window.onload = () => {

  setTimeout(() => {

    window.print();

  }, 300);

};

</script>

</body>
</html>
`);

  printWindow.document.close();
};
