"use client";

import { useState } from "react";

import {
  Plus,
  Minus,
  Trash2,
  Search,
  X,
} from "lucide-react";

import {
  getProducts,
} from "@/src/services/product.service";



interface Product {

  _id:string;

  title:{
    en:string;
    bn?:string;
  };

  price:number;

  discountPrice?:number;

  flashSalePrice?:number;

  isFlashSale?:boolean;

  images:string[];

  isActive:boolean;

}



interface Props {

  items:any[];

  setItems:(items:any[])=>void;

  locked:boolean;

}




export default function EditableOrderItems({

items,

setItems,

locked,

}:Props){



const [showProducts,setShowProducts]=useState(false);

const [products,setProducts]=useState<Product[]>([]);

const [search,setSearch]=useState("");






const askPermission=(message:string)=>{


return window.confirm(

`${message}

Are you sure you want to update this order?`

);


};







const loadProducts=async()=>{


try{


const data:any = await getProducts();


setProducts(

data.products || data

);


}catch(error){

console.log(error);

}


};








const getName=(product:Product)=>{


return product.title?.en || "Product";


};








const getProductPrice=(product:Product)=>{


if(

product.isFlashSale &&

product.flashSalePrice &&

product.flashSalePrice>0

){

return product.flashSalePrice;

}




if(

product.discountPrice &&

product.discountPrice>0

){

return product.discountPrice;

}




return product.price;


};









const addProduct=(product:Product)=>{


if(

!askPermission(

`Add "${getName(product)}"`

)

){

return;

}



const price=getProductPrice(product);



const exist=items.find(

item=>item.product===product._id

);





if(exist){



setItems(

items.map(item=>

item.product===product._id

?

{

...item,

quantity:item.quantity+1,

totalPrice:

(item.quantity+1)*item.price

}

:item

)

);



}

else{



setItems([

...items,

{

product:product._id,

productName:getName(product),

productImage:

product.images?.[0] || "",

price,

quantity:1,

totalPrice:price,

}

]);



}



setShowProducts(false);


};








const updateQty=(

index:number,

type:"inc"|"dec"

)=>{



if(

!askPermission(

"Change quantity"

)

){

return;

}



const data=[...items];


let qty=data[index].quantity;




if(type==="inc"){

qty++;

}




if(

type==="dec" && qty>1

){

qty--;

}





data[index]={

...data[index],

quantity:qty,

totalPrice:

data[index].price*qty

};




setItems(data);



};









const removeItem=(index:number)=>{


if(

!askPermission(

`Remove ${items[index].productName}`

)

){

return;

}



const data=[...items];


data.splice(index,1);


setItems(data);


};








const total=

items.reduce(

(sum,item)=>

sum+(item.totalPrice || 0),

0

);







const filtered=

products.filter(product=>

getName(product)

.toLowerCase()

.includes(

search.toLowerCase()

)

);return (

<div className="
bg-white
border
rounded-xl
overflow-hidden
">


{/* HEADER */}

<div className="
p-5
border-b
flex
justify-between
items-center
">


<div>

<h2 className="
text-lg
font-bold
">

Order Details

</h2>


<p className="
text-sm
text-gray-500
mt-1
">

Manage ordered products

</p>


</div>





<button


disabled={locked}


onClick={()=>{


if(
askPermission(
"Add new product to order?"
)
){

setShowProducts(true);

loadProducts();

}


}}


className="
bg-blue-600
text-white
px-4
py-2
rounded-lg
flex
items-center
gap-2
text-sm
hover:bg-blue-700
disabled:opacity-50
"

>


<Plus size={16}/>

Add Item


</button>



</div>






{/* PRODUCT TABLE */}


<div className="
overflow-x-auto
">


<table className="
w-full
text-sm
">



<thead className="
bg-gray-50
">


<tr className="
border-b
">


<th className="
p-4
text-left
">

Product

</th>



<th className="
p-4
text-center
">

Qty

</th>




<th className="
p-4
text-right
">

Unit Price

</th>




<th className="
p-4
text-right
">

Total

</th>




<th className="
p-4
text-center
">

Action

</th>



</tr>


</thead>






<tbody>


{

items.map((item,index)=>(



<tr

key={index}

className="
border-b
hover:bg-gray-50
"

>



{/* PRODUCT */}

<td className="
p-4
">


<div className="
flex
items-center
gap-4
">


<img


src={
item.productImage ||
"/placeholder.png"
}


className="
w-16
h-16
rounded-lg
object-cover
border
"

/>




<div>


<p className="
font-semibold
text-gray-800
">

{item.productName}

</p>


<p className="
text-xs
text-gray-500
">

Product Item

</p>


</div>



</div>


</td>







{/* QTY */}

<td className="
p-4
">


<div className="
flex
justify-center
items-center
gap-3
">


<button


disabled={locked}


onClick={()=>updateQty(index,"dec")}


className="
border
rounded-md
p-1
hover:bg-gray-100
disabled:opacity-50
"


>


<Minus size={14}/>


</button>





<span className="
font-semibold
">

{item.quantity}

</span>





<button


disabled={locked}


onClick={()=>updateQty(index,"inc")}


className="
border
rounded-md
p-1
hover:bg-gray-100
disabled:opacity-50
"


>


<Plus size={14}/>


</button>



</div>


</td>









{/* PRICE */}

<td className="
p-4
text-right
">


QAR {Number(item.price).toFixed(2)}


</td>








{/* TOTAL */}

<td className="
p-4
text-right
font-bold
">


QAR {Number(item.totalPrice).toFixed(2)}


</td>







{/* DELETE */}

<td className="
p-4
text-center
">


<button


disabled={locked}


onClick={()=>removeItem(index)}


className="
text-red-500
hover:text-red-700
disabled:opacity-50
"


>


<Trash2 size={18}/>


</button>



</td>



</tr>



))


}



</tbody>


</table>


</div>







{/* TOTAL FOOTER */}


<div className="
p-5
border-t
flex
justify-between
items-center
">


<div className="
text-gray-600
">


Total Items:

<span className="
font-bold
ml-2
">

{items.length}

</span>


</div>





<div className="
text-xl
font-bold
">


QAR {total.toFixed(2)}


</div>



</div>{/* PRODUCT MODAL */}

{
showProducts && (

<div className="
fixed
inset-0
bg-black/50
flex
items-center
justify-center
z-50
">

<div className="
bg-white
w-full
max-w-2xl
rounded-2xl
shadow-xl
max-h-[80vh]
overflow-hidden
">


{/* MODAL HEADER */}

<div className="
p-4
border-b
flex
justify-between
items-center
">

<h3 className="
font-semibold
text-lg
">

Select Product

</h3>

<button
onClick={()=>setShowProducts(false)}
className="
p-2
hover:bg-gray-100
rounded-lg
"
>
<X size={18}/>
</button>

</div>



{/* SEARCH */}

<div className="p-4 border-b">

<div className="
flex
items-center
border
rounded-lg
px-3
">

<Search
size={18}
className="text-gray-500"
/>

<input
type="text"
placeholder="Search product..."
value={search}
onChange={(e)=>
setSearch(e.target.value)
}
className="
w-full
p-3
outline-none
"
/>

</div>

</div>



{/* PRODUCT LIST */}

<div className="
max-h-[500px]
overflow-y-auto
p-4
">

{
filtered.map((product)=>(

<div

key={product._id}

onClick={()=>
addProduct(product)
}

className="
border
rounded-xl
p-3
mb-3
cursor-pointer
hover:bg-gray-50
transition
flex
items-center
gap-4
"

>

<img

src={
product.images?.[0] ||
"/placeholder.png"
}

alt={getName(product)}

className="
w-16
h-16
rounded-lg
object-cover
border
"

/>


<div className="flex-1">

<h4 className="
font-semibold
text-gray-800
">

{getName(product)}

</h4>

<p className="
text-sm
text-green-600
font-medium
">

QAR {getProductPrice(product)}

</p>

</div>

</div>

))
}


{
filtered.length===0 && (

<div className="
text-center
py-10
text-gray-500
">

No products found

</div>

)

}

</div>

</div>

</div>

)

}

</div>

);

}
