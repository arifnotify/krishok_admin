"use client";

import { Order } from "@/src/types/order";
import {
  CheckCircle,
  Clock,
  Package,
  Truck,
  Home
} from "lucide-react";


interface Props {
  order: Order;
}



export default function OrderTimeline({
  order
}: Props) {



const steps = [

{
key:"Pending",
label:"Order Placed",
icon:Clock
},

{
key:"Processing",
label:"Processing",
icon:Package
},


{
key:"OutForDelivery",
label:"Out For Delivery",
icon:Truck
},


{
key:"Delivered",
label:"Delivered",
icon:Home
}

];





const currentIndex =
steps.findIndex(
(step)=>
step.key===order.orderStatus
);





return (

<div className="
bg-white
border
rounded-xl
p-5
h-full
">


{/* HEADER */}

<div className="
flex
items-center
gap-2
mb-6
">


<CheckCircle

size={20}

className="text-green-600"

/>


<div>


<h2 className="
font-bold
text-gray-800
">

Order Timeline

</h2>


<p className="
text-xs
text-gray-500
">

Order progress tracking

</p>


</div>


</div>







<div className="
relative
space-y-6
">



{/* LINE */}

<div className="
absolute
left-5
top-3
bottom-3
w-[2px]
bg-gray-200
"/>






{
steps.map((step,index)=>{


const active =
index <= currentIndex;



const Icon =
step.icon;



return(


<div

key={step.key}

className="
relative
flex
items-center
gap-4
"


>


{/* ICON */}

<div

className={`
relative
z-10
w-10
h-10
rounded-full
flex
items-center
justify-center

${
active

?

"bg-green-100 text-green-600"

:

"bg-gray-100 text-gray-400"

}

`}

>

<Icon size={18}/>


</div>








<div>


<p

className={`
font-semibold
text-sm

${
active
?
"text-gray-800"
:
"text-gray-400"

}

`}

>

{step.label}

</p>



<p className="
text-xs
text-gray-500
mt-1
">


{
active

?

index===currentIndex

?

"Current status"

:

"Completed"

:

"Waiting"

}


</p>


</div>





{
index===currentIndex && (

<span className="
ml-auto
text-xs
px-3
py-1
rounded-full
bg-blue-100
text-blue-600
font-semibold
">


Current


</span>

)

}





</div>


)


})

}



</div>




</div>


)

}
