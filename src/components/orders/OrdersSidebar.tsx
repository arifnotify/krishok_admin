"use client";

import { Order } from "@/src/types/order";

interface Props {
  activeOrders: Order[];
  completedOrders: Order[];

  selectedId?: string;

  onSelect: (id: string) => void;
}


const getStatusColor = (status:string)=>{

  switch(status){

    case "Pending":
      return "bg-orange-100 text-orange-700";

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



export default function OrdersSidebar({
  activeOrders,
  completedOrders,
  selectedId,
  onSelect

}:Props){


return (

<div className="
h-[calc(100vh-220px)]
flex
flex-col
bg-white
">


{/* ================= HEADER ================= */}

<div className="
p-5
border-b
bg-white
">

<h2 className="
text-2xl
font-bold
text-slate-900
">
Orders
</h2>


<p className="
text-sm
text-slate-500
mt-1
">

{activeOrders.length} Active • {completedOrders.length} Completed

</p>


</div>





{/* ================= ACTIVE ORDERS ================= */}


<div className="
flex-[7]
overflow-y-auto
p-4
border-b
">


<div className="
flex
justify-between
items-center
mb-4
">


<h3 className="
font-bold
text-blue-600
uppercase
text-sm
tracking-wider
">

Active Orders

</h3>


<span className="
text-xs
bg-blue-100
text-blue-700
px-3
py-1
rounded-full
">

{activeOrders.length}

</span>


</div>




<div className="space-y-4">


{
activeOrders.length===0 && (

<div className="
border
rounded-2xl
p-6
text-center
text-gray-400
">

No Active Orders

</div>

)

}



{
activeOrders.map((order)=>(


<button

key={order._id}

onClick={()=>onSelect(order._id)}

className={`
w-full
text-left
rounded-2xl
border
p-5
transition-all


${
selectedId===order._id

?

`
border-pink-500
bg-pink-50
shadow-md
`

:

`
border-slate-200
bg-white
hover:border-pink-300
hover:shadow-sm
`

}

`}

>


<div className="
flex
justify-between
items-start
">


<div>


<p className="
font-bold
text-lg
text-slate-900
">

#{order.orderNumber}

</p>


<p className="
text-sm
text-slate-500
mt-1
">

{order.customerPhone}

</p>


</div>



<span

className={`
text-xs
px-3
py-1
rounded-full
${getStatusColor(order.orderStatus)}

`}

>

{order.orderStatus}

</span>



</div>





<div className="
mt-5
flex
justify-between
items-center
">


<span className="
text-green-600
font-bold
text-lg
">

৳{order.totalAmount}

</span>


<span className="
text-xs
text-slate-400
">

New Order

</span>



</div>



</button>


))

}


</div>



</div>







{/* ================= COMPLETED ORDERS ================= */}



<div className="
flex-[3]
overflow-y-auto
p-4
bg-slate-50
">


<div className="
flex
justify-between
items-center
mb-3
">


<h3 className="
font-bold
text-green-600
uppercase
text-sm
tracking-wider
">

Completed

</h3>


<span className="
text-xs
bg-green-100
text-green-700
px-2
py-1
rounded-full
">

{completedOrders.length}

</span>


</div>




<div className="space-y-2">


{
completedOrders.length===0 && (

<div className="
border
rounded-xl
p-4
text-center
text-gray-400
bg-white
">

No Completed Orders

</div>

)

}




{
completedOrders.map((order)=>(


<button

key={order._id}

onClick={()=>onSelect(order._id)}

className={`
w-full
text-left
rounded-xl
border
p-3
bg-white
transition


${
selectedId===order._id

?

`
border-green-500
bg-green-50
`

:

`
border-slate-200
hover:border-green-300
`

}

`}

>


<div className="
flex
justify-between
items-center
">


<div>


<p className="
font-semibold
text-sm
text-slate-900
">

#{order.orderNumber}

</p>


<p className="
text-xs
text-slate-500
">

{order.customerPhone}

</p>


</div>



<span className="
text-sm
font-bold
text-green-600
">

৳{order.totalAmount}

</span>



</div>


</button>


))

}



</div>


</div>



</div>

);


}
