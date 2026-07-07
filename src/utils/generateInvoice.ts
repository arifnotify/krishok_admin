import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { InvoiceData } from "@/src/types/invoice";
import { formatCurrency } from "@/src/utils/currency";
import { COMPANY } from "../components/company";

// ===============================
// HEADER
// ===============================
const drawCompanyHeader = (doc: jsPDF) => {
  doc.setFillColor(33, 150, 243);
  doc.rect(0, 0, 210, 35, "F");

  doc.setTextColor(255, 255, 255);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);

  doc.text(COMPANY.name, 14, 20);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  doc.text(COMPANY.slogan, 14, 28);

  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");

  doc.text("INVOICE", 150, 20);

  doc.setTextColor(0, 0, 0);
};

// ===============================
// COMPANY INFO
// ===============================
const drawCompanyInfo = (doc: jsPDF) => {
  let y = 45;

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Company Information", 14, y);

  y += 8;

  doc.setFont("helvetica", "normal");

  doc.text(`Address: ${COMPANY.address}`, 14, y);
  y += 6;

  doc.text(`Phone: ${COMPANY.phone}`, 14, y);
  y += 6;

  doc.text(`Email: ${COMPANY.email}`, 14, y);
  y += 6;

  doc.text(`Website: ${COMPANY.website}`, 14, y);
};

// ===============================
// ORDER INFO
// ===============================
const drawOrderInfo = (
  doc: jsPDF,
  invoice: InvoiceData
) => {
  let y = 45;

  doc.setFont("helvetica", "bold");
  doc.text("Invoice Info", 130, y);

  y += 8;

  doc.setFont("helvetica", "normal");

  doc.text(`Invoice: ${invoice.invoiceNumber}`, 130, y);
  y += 6;

  doc.text(`Order: ${invoice.orderNumber}`, 130, y);
  y += 6;

  doc.text(`Date: ${invoice.invoiceDate}`, 130, y);
  y += 6;

  doc.text(`Status: ${invoice.orderStatus}`, 130, y);
};

// ===============================
// CUSTOMER SECTION
// ===============================
const drawCustomerSection = (
  doc: jsPDF,
  invoice: InvoiceData
) => {
  let y = 85;

  doc.setFont("helvetica", "bold");
  doc.text("Customer Information", 14, y);

  y += 10;

  doc.setFont("helvetica", "normal");

  doc.text(
    `Name: ${invoice.customer.name || "Customer"}`,
    14,
    y
  );
  y += 6;

  doc.text(`Phone: ${invoice.customer.phone}`, 14, y);
  y += 6;

  doc.text(`Address: ${invoice.customer.address}`, 14, y);

  doc.line(14, y + 6, 196, y + 6);
};

// ===============================
// PRODUCT TABLE
// ===============================
const drawProductTable = (
  doc: jsPDF,
  invoice: InvoiceData
) => {
  autoTable(doc, {
    startY: 110,

    head: [["Product", "Qty", "Price", "Total"]],

    body: invoice.items.map((item) => [
      item.productName,
      item.quantity,
      formatCurrency(item.price),
      formatCurrency(item.totalPrice),
    ]),

    theme: "striped",

    headStyles: {
      fillColor: [33, 150, 243],
      textColor: 255,
      fontStyle: "bold",
    },

    styles: {
      fontSize: 10,
    },

    margin: { left: 14, right: 14 },
  });
};

// ===============================
// TOTAL SECTION
// ===============================
const drawTotalSection = (
  doc: jsPDF,
  invoice: InvoiceData
) => {
  const finalY =
    (doc as any).lastAutoTable.finalY + 10;

  let y = finalY;

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");

  doc.text("Subtotal:", 130, y);
  doc.text(
    formatCurrency(invoice.subtotal),
    180,
    y,
    { align: "right" }
  );

  y += 6;

  doc.text("Delivery:", 130, y);
  doc.text(
    formatCurrency(invoice.deliveryCharge),
    180,
    y,
    { align: "right" }
  );

  y += 6;

  doc.text("Discount:", 130, y);
  doc.text(
    formatCurrency(invoice.discount),
    180,
    y,
    { align: "right" }
  );

  y += 8;

  doc.line(130, y, 200, y);

  y += 8;

  doc.setFont("helvetica", "bold");

  doc.text("Grand Total:", 130, y);
  doc.text(
    formatCurrency(invoice.total),
    180,
    y,
    { align: "right" }
  );
};

// ===============================
// PAYMENT SECTION
// ===============================
const drawPaymentSection = (
  doc: jsPDF,
  invoice: InvoiceData
) => {
  let y = 235;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  doc.text(
    `Payment Method: ${invoice.paymentMethod}`,
    14,
    y
  );

  y += 6;

  doc.text(
    `Payment Status: ${
      invoice.paymentStatus ? "PAID" : "UNPAID"
    }`,
    14,
    y
  );

  y += 10;

  doc.setFillColor(
    invoice.paymentStatus ? 76 : 244,
    invoice.paymentStatus ? 175 : 67,
    invoice.paymentStatus ? 80 : 54
  );

  doc.rect(14, y, 40, 8, "F");

  doc.setTextColor(255, 255, 255);

  doc.text(
    invoice.paymentStatus ? "PAID" : "PENDING",
    22,
    y + 6
  );

  doc.setTextColor(0, 0, 0);
};

// ===============================
// FOOTER
// ===============================
const drawFooter = (doc: jsPDF) => {
  const pageHeight =
    doc.internal.pageSize.height;

  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");

  doc.text(
    "Thank you for choosing Babuni Food!",
    105,
    pageHeight - 20,
    { align: "center" }
  );

  doc.setFontSize(8);
  doc.text(
    "This is a system generated invoice.",
    105,
    pageHeight - 14,
    { align: "center" }
  );
};

// ===============================
// MAIN FUNCTION
// ===============================
export const generateInvoice = (
  invoice: InvoiceData
) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  doc.setTextColor(0, 0, 0);

  drawCompanyHeader(doc);
  drawCompanyInfo(doc);
  drawOrderInfo(doc, invoice);
  drawCustomerSection(doc, invoice);
  drawProductTable(doc, invoice);
  drawTotalSection(doc, invoice);
  drawPaymentSection(doc, invoice);
  drawFooter(doc);

  doc.save(
    `${COMPANY.invoicePrefix}-${invoice.invoiceNumber}.pdf`
  );
};