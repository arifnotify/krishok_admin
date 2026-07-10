"use client";

import { Order } from "@/src/types/order";
import { CheckCircle } from "lucide-react";


interface Props {
  order: Order;
  onChange:(status:string)=>void;
}



export default function StatusCard({

order,
onChange

}:Props){



const locked =
order.orderStatus==="Delivered" ||
order.orderStatus==="Cancelled";




const statusStyle=(status:string)=>{


switch(status){


case "Pending":
return "bg-yellow-100 text-yellow-700";


case "Processing":
return "bg-blue-100 text-blue-700";


case "OutForDelivery":
return "bg-purple-100 text-purple-700";


case "Delivered":
return "bg-green-100 text-green-700";


case "Cancelled":
return "bg-red-100 text-red-700";


default:
return "bg-gray-100 text-gray-700";


}



};





return(

<div className="
bg-white
border
rounded-xl
p-5
h-full
">


<div className="
flex
items-center
gap-2
mb-5
">


<CheckCircle
size={20}
className="text-blue-600"
/>


<h2 className="
font-bold
text-gray-800
">

Order Status

</h2>


</div>





<div className="
mb-5
">

<p className="
text-xs
text-gray-500
mb-2
">

Current Status

</p>


<span className={`
px-4
py-2
rounded-full
text-xs
font-semibold
${statusStyle(order.orderStatus)}
`}>

{order.orderStatus}

</span>


</div>







<label className="
text-sm
font-medium
text-gray-600
">

Update Status

</label>




<select

disabled={locked}

value={order.orderStatus}

onChange={(e)=>
onChange(e.target.value)
}


className="
w-full
mt-2
border
rounded-lg
px-3
py-3
outline-none
disabled:bg-gray-100
"


>


<option value="Pending">
Pending
</option>


<option value="Processing">
Processing
</option>


<option value="OutForDelivery">
Out For Delivery
</option>


<option value="Delivered">
Delivered
</option>


<option value="Cancelled">
Cancelled
</option>



</select>






{
locked && (

<div className="
mt-4
bg-red-50
border
border-red-200
rounded-lg
p-3
">

<p className="
text-xs
text-red-600
font-semibold
">

🔒 Order Locked

</p>


</div>

)

}



</div>


)

}
