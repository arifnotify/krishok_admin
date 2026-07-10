"use client";

import CustomerInfoCard from "./CustomerInfoCard";
import StatusCard from "./StatusCard";
import RiderCard from "./RiderCard";
import OrderSummary from "./OrderSummary";
import OrderTimeline from "./OrderTimeline";
import EditableOrderItems from "./EditableOrderItems";

import { printReceipt } from "@/src/utils/printReceipt";


export default function OrderDetailsPanel({

  order,
  riders,
  selectedRider,
  setSelectedRider,
  assignRider,
  updateStatus,
  items,
  setItems,
  saveItems,
  saving,

}:any){



if(!order){

return(

<div className="
bg-white
border
rounded-2xl
p-10
text-center
text-gray-500
">

Select Order

</div>

)

}




const locked =
order.orderStatus==="Delivered" ||
order.orderStatus==="Cancelled";





const buildInvoice=()=>{


const subtotal =
items?.reduce(
(sum:number,item:any)=>
sum+(item.totalPrice||0),
0
)||0;



return{

invoiceNumber:order.orderNumber,

orderNumber:order.orderNumber,

invoiceDate:new Date().toISOString(),


customer:{

name:
order.shippingAddress?.fullName || "Customer",

phone:
order.customerPhone,


address:
`${order.shippingAddress?.areaOrVillage || ""} 
${order.shippingAddress?.landmark || ""}`

},


items,


subtotal,


deliveryCharge:
order.deliveryCharge || 0,


discount:
order.discount || 0,


total:subtotal,


paymentMethod:
order.paymentMethod,


paymentStatus:
order.isPaid,


orderStatus:
order.orderStatus,


}



};






return(


<div className="
space-y-6
">





{/* TOP HEADER */}


<div className="
bg-white
border
rounded-2xl
p-5
flex
justify-between
items-center
">


<div>


<h1 className="
text-xl
font-bold
">

Order #{order.orderNumber}

</h1>



<p className="
text-sm
text-gray-500
mt-1
">

{items?.length || 0} Items • Delivery Order

</p>


</div>





<button


onClick={()=>printReceipt(buildInvoice())}


className="
border
px-5
py-2
rounded-xl
text-sm
hover:bg-gray-50
"


>

🖨 Print Receipt


</button>



</div>







{/* CUSTOMER / STATUS / RIDER */}


<div className="
grid
grid-cols-1
lg:grid-cols-3
gap-5
">


<div className="
bg-white
rounded-2xl
border
p-1
">

<CustomerInfoCard
order={order}
/>

</div>





<div className="
bg-white
rounded-2xl
border
p-1
">


<StatusCard

order={order}

onChange={updateStatus}

/>


</div>






<div className="
bg-white
rounded-2xl
border
p-1
">


<RiderCard

riders={riders}

selectedRider={selectedRider}

setSelectedRider={setSelectedRider}

assign={assignRider}

locked={locked}

/>


</div>




</div>







{/* ORDER ITEMS */}


<div>

<EditableOrderItems

items={items}

setItems={setItems}

locked={locked}

/>

</div>








{/* SAVE BUTTON */}



{
!locked &&

<div className="
flex
justify-end
">


<button


onClick={saveItems}


disabled={saving}


className="
bg-blue-600
text-white
px-7
py-3
rounded-xl
hover:bg-blue-700
disabled:opacity-50
"


>


{
saving
?
"Saving..."
:
"Save Changes"
}


</button>


</div>

}







{/* SUMMARY + TIMELINE */}



<div className="
grid
grid-cols-1
lg:grid-cols-2
gap-5
">



<div className="
bg-white
border
rounded-2xl
p-1
">


<OrderSummary

order={{
...order,
items
}}

/>


</div>







<div className="
bg-white
border
rounded-2xl
p-1
">


<OrderTimeline

order={order}

/>


</div>



</div>





</div>


)


}
