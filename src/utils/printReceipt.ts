import { InvoiceData } from "@/src/types/invoice";
import { COMPANY } from "../components/company";
import { formatCurrency } from "./currency";

export const printReceipt = (
  invoice: InvoiceData
) => {

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
    (sum: number, item: any) =>
      sum + Number(item.quantity || 0),
    0
  );

  const subtotal =
    Number(invoice.subtotal || 0);

  const deliveryCharge =
    Number(invoice.deliveryCharge || 0);

  const discount =
    Number(invoice.discount || 0);

  const grandTotal =
    subtotal +
    deliveryCharge -
    discount;

  const itemsHtml = invoice.items
    .map(
      (item: any) => `
      <div class="item">

        <div class="item-row">

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

<meta charset="UTF-8" />

<title>Receipt</title>

<style>

*{
  margin:0;
  padding:0;
  box-sizing:border-box;
}

body{
  width:80mm;
  margin:auto;
  padding:10px;
  font-family:Arial, Helvetica, sans-serif;
  color:#000;
  background:#fff;
}

.receipt{
  width:100%;
}

.center{
  text-align:center;
}

.company{
  font-size:26px;
  font-weight:800;
  margin-bottom:5px;
}

.subtitle{
  font-size:14px;
}

.date{
  margin-top:8px;
  font-size:12px;
}

.line{
  border-top:1px dashed #999;
  margin:12px 0;
}

.order-label{
  font-size:14px;
}

.order-number{
  font-size:42px;
  font-weight:800;
  margin-top:8px;
  letter-spacing:2px;
}

.customer{
  font-size:14px;
  line-height:1.7;
}

.customer strong{
  display:inline-block;
  width:70px;
}

.item{
  margin-bottom:10px;
}

.item-row{
  display:flex;
  justify-content:space-between;
  align-items:flex-start;
  gap:10px;
}

.item-name{
  flex:1;
  font-size:14px;
  font-weight:600;
}

.item-price{
  font-size:14px;
  font-weight:700;
  white-space:nowrap;
}

.summary{
  margin-top:5px;
}

.summary-row{
  display:flex;
  justify-content:space-between;
  margin-bottom:8px;
  font-size:15px;
}

.total-row{
  display:flex;
  justify-content:space-between;
  margin-top:12px;
  padding-top:10px;
  border-top:1px dashed #999;
  font-size:22px;
  font-weight:800;
}

.payment{
  margin-top:15px;
  text-align:center;
}

.payment-method{
  font-size:18px;
  font-weight:700;
  margin-top:5px;
}

.footer{
  margin-top:20px;
  text-align:center;
}

.footer h3{
  font-size:24px;
  margin-bottom:8px;
}

.footer p{
  font-size:12px;
  line-height:1.5;
}

@media print{

  body{
    width:80mm;
  }

}

</style>

</head>

<body>

<div class="receipt">

  <div class="center">

    <div class="company">
      ${COMPANY.name}
    </div>

    <div class="subtitle">
      Delivery Receipt
    </div>

    <div class="date">
      ${new Date().toLocaleString()}
    </div>

  </div>

  <div class="line"></div>

  <div class="center">

    <div class="order-label">
      Order Number
    </div>

    <div class="order-number">
      ${invoice.orderNumber}
    </div>

  </div>

  <div class="line"></div>

  <div class="customer">

    <div>
      <strong>Name:</strong>
      ${invoice.customer.name}
    </div>

    <div>
      <strong>Phone:</strong>
      ${invoice.customer.phone}
    </div>

    <div>
      <strong>Address:</strong>
      ${invoice.customer.address}
    </div>

  </div>

  <div class="line"></div>

  ${itemsHtml}

  <div class="line"></div>

  <div class="summary">

    <div class="summary-row">
      <span>Items</span>
      <span>${totalItems}</span>
    </div>

    <div class="summary-row">
      <span>Subtotal</span>
      <span>${formatCurrency(subtotal)}</span>
    </div>

    <div class="summary-row">
      <span>Delivery Fee</span>
      <span>${formatCurrency(deliveryCharge)}</span>
    </div>

    ${
      discount > 0
        ? `
        <div class="summary-row">
          <span>Discount</span>
          <span>-${formatCurrency(discount)}</span>
        </div>
      `
        : ""
    }

    <div class="total-row">
      <span>Total</span>
      <span>${formatCurrency(grandTotal)}</span>
    </div>

  </div>

  <div class="line"></div>

  <div class="payment">

    <div>
      Payment Method
    </div>

    <div class="payment-method">
      ${invoice.paymentMethod}
    </div>

  </div>

  <div class="footer">

    <h3>
      Thank You!
    </h3>

    <p>
      ${COMPANY.address}
    </p>

    <p>
      ${COMPANY.phone}
    </p>

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
