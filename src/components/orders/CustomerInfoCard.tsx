"use client";

import { Order } from "@/src/types/order";
import {
 Phone,
 MapPin,
 User
} from "lucide-react";


interface Props{
 order:Order;
}


export default function CustomerInfoCard({
order
}:Props){


const address=order.shippingAddress;


return(

<div className="
bg-white
rounded-xl
border
p-5
h-full
">


<div className="
flex
items-center
gap-2
mb-5
">

<User
size={20}
className="text-blue-600"
/>


<h2 className="
font-bold
text-gray-800
">

Customer Information

</h2>


</div>



<div className="
space-y-4
text-sm
">


<div>

<p className="text-gray-500">
Name
</p>

<p className="font-semibold">
{address?.fullName || "N/A"}
</p>

</div>




<div>

<p className="text-gray-500">
Phone
</p>

<p className="font-semibold flex gap-2 items-center">

<Phone size={15}/>

{order.customerPhone}

</p>

</div>





<div>

<p className="text-gray-500">
Address
</p>


<p className="
font-medium
text-gray-700
flex
gap-2
">

<MapPin size={15}/>

{address?.areaOrVillage || "N/A"}

</p>


</div>




</div>


</div>


)

}
