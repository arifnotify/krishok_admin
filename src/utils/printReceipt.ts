import { InvoiceData } from "@/src/types/invoice";
import { COMPANY } from "../components/company";
import { formatCurrency } from "./currency";


export const printReceipt = (
  invoice: InvoiceData
) => {


const printWindow = window.open(
  "",
  "_blank",
  "width=400,height=800"
);



if(!printWindow){

alert("Popup blocked");

return;

}



// ===============================
// TOTAL CALCULATION
// ===============================


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



const totalItems =
invoice.items.reduce(
(sum,item)=>
sum + item.quantity,
0
);




// ===============================
// ITEMS
// ===============================


const itemsHTML = invoice.items
.map(
(item:any)=>
`

<div class="item">


<div class="item-row">


<div class="product">


<div class="en">

${item.quantity} × ${item.productName}

</div>



${
item.productNameBn
?
`
<div class="bn">

${item.productNameBn}

</div>
`
:
""
}


</div>



<div class="price">

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


<title>
Receipt
</title>



<style>


*{

box-sizing:border-box;

}



body{

width:80mm;

margin:auto;

padding:10px;

font-family:

Arial,

"Noto Sans Bengali",

sans-serif;

color:#000;

}



.center{

text-align:center;

}



.company{

font-size:24px;

font-weight:800;

}



.small{

font-size:12px;

}



.line{

border-top:1px dashed #000;

margin:12px 0;

}



.order-title{

font-size:14px;

}



.order-number{

font-size:42px;

font-weight:900;

letter-spacing:2px;

margin-top:8px;

}



.customer{

font-size:13px;

line-height:1.6;

}



.item{

margin-bottom:10px;

}



.item-row{

display:flex;

justify-content:space-between;

gap:10px;

}



.product{

width:70%;

}



.en{

font-size:14px;

font-weight:700;

}



.bn{

font-size:13px;

margin-top:3px;

color:#444;

}



.price{

font-size:14px;

font-weight:700;

white-space:nowrap;

}



.summary{

font-size:15px;

}



.row{

display:flex;

justify-content:space-between;

margin-bottom:8px;

}



.total{

display:flex;

justify-content:space-between;

font-size:22px;

font-weight:900;

border-top:1px dashed #000;

padding-top:10px;

margin-top:10px;

}



.payment{

text-align:center;

margin-top:15px;

}



.payment-method{

font-size:20px;

font-weight:bold;

}



.thanks{

text-align:center;

margin-top:20px;

font-size:25px;

font-weight:800;

}



.footer{

text-align:center;

font-size:12px;

margin-top:10px;

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



<div class="center">


<div class="company">

${COMPANY.name}

</div>



<div class="small">

Delivery Receipt

</div>



<div class="small">

${new Date().toLocaleString()}

</div>


</div>





<div class="line"></div>




<div class="center">


<div class="order-title">

ORDER NUMBER

</div>


<div class="order-number">

${invoice.orderNumber}

</div>


</div>





<div class="line"></div>





<div class="customer">


<b>
Customer:
</b>

${invoice.customer.name}


<br/>


<b>
Phone:
</b>

${invoice.customer.phone}


<br/>


<b>
Address:
</b>

${invoice.customer.address}


</div>





<div class="line"></div>





${itemsHTML}






<div class="line"></div>





<div class="summary">


<div class="row">

<span>
Items
</span>


<span>
${totalItems}
</span>

</div>




<div class="row">

<span>
Subtotal
</span>


<span>

${formatCurrency(subtotal)}

</span>

</div>





<div class="row">

<span>
Delivery Fee
</span>


<span>

${formatCurrency(deliveryCharge)}

</span>


</div>





${
discount > 0
?
`

<div class="row">

<span>
Discount
</span>


<span>

- ${formatCurrency(discount)}

</span>


</div>

`
:
""
}






<div class="total">


<span>

TOTAL

</span>


<span>

${formatCurrency(grandTotal)}

</span>


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






<div class="thanks">

Thank You ❤️

</div>





<div class="footer">


${COMPANY.address}


<br/>


${COMPANY.phone}


</div>






<script>


window.onload=function(){


setTimeout(()=>{


window.print();


},300);


}



</script>



</body>

</html>


`);



printWindow.document.close();


};
