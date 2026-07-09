import { InvoiceData } from "@/src/types/invoice";
import { COMPANY } from "../components/company";
import { formatCurrency } from "./currency";


export const printReceipt = (
  invoice: InvoiceData
) => {

  const printWindow = window.open(
    "",
    "_blank",
    "width=400,height=700"
  );


  if (!printWindow) {
    alert("Popup blocked. Please allow popup.");
    return;
  }


  const items = invoice.items
    .map(
      (item) => `
        <tr>
          <td>${item.productName}</td>
          <td>${item.quantity}</td>
          <td>
            ${formatCurrency(item.totalPrice)}
          </td>
        </tr>
      `
    )
    .join("");



  printWindow.document.write(`

<!DOCTYPE html>

<html>

<head>

<title>Receipt</title>


<style>

body{

  font-family: Arial, sans-serif;

  width: 300px;

  margin:auto;

  padding:15px;

}


.center{

 text-align:center;

}


h2{

 margin:0;

}


hr{

 border:none;

 border-top:1px dashed #000;

}


table{

 width:100%;

 border-collapse:collapse;

 margin-top:10px;

}


td,th{

 font-size:12px;

 padding:5px 0;

 border-bottom:1px dashed #ccc;

}


.total{

 display:flex;

 justify-content:space-between;

 margin-top:5px;

 font-size:14px;

}


.grand{

 font-size:16px;

 font-weight:bold;

 margin-top:10px;

}


.footer{

 margin-top:20px;

 text-align:center;

 font-size:12px;

}



@media print{

 button{

  display:none;

 }

}


</style>


</head>


<body>



<div class="center">

<h2>
${COMPANY.name}
</h2>


<p>

${COMPANY.phone}

<br/>

${COMPANY.address}

</p>


</div>


<hr/>


<p>

<b>Order:</b>
${invoice.orderNumber}

<br/>

<b>Date:</b>
${new Date().toLocaleString()}

</p>



<p>

<b>Customer:</b>

<br/>

${invoice.customer.name}

<br/>

${invoice.customer.phone}

<br/>

${invoice.customer.address}

</p>



<hr/>





<table>


<thead>

<tr>

<th>
Item
</th>


<th>
Qty
</th>


<th>
Total
</th>


</tr>

</thead>



<tbody>

${items}

</tbody>


</table>





<hr/>




<div class="total">

<span>
Subtotal
</span>


<span>
${formatCurrency(invoice.subtotal)}
</span>


</div>



<div class="total">

<span>
Delivery
</span>


<span>
${formatCurrency(invoice.deliveryCharge)}
</span>


</div>



<div class="total">

<span>
Discount
</span>


<span>
${formatCurrency(invoice.discount)}
</span>


</div>





<div class="total grand">


<span>
Total
</span>


<span>

${formatCurrency(invoice.total)}

</span>


</div>




<hr/>




<p>

<b>
Payment:
</b>

${invoice.paymentMethod}

</p>



<p>

<b>
Status:
</b>

${invoice.orderStatus}

</p>





<div class="footer">

Thank you for shopping ❤️

<br/>

${COMPANY.name}

</div>




<script>

window.onload=function(){

 window.print();

}


</script>



</body>


</html>


`);


printWindow.document.close();


};
