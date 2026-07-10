"use client";

import { useState } from "react";
import { Plus, Minus, Trash2, Search, X } from "lucide-react";
import { getProducts } from "@/src/services/product.service";

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

interface Props{
  items:any[];
  setItems:(items:any[])=>void;
  locked:boolean;
}


export default function EditableOrderItems({
  items,
  setItems,
  locked
}:Props){


const [showProducts,setShowProducts]=useState(false);
const [products,setProducts]=useState<Product[]>([]);
const [search,setSearch]=useState("");



const askPermission=(message:string)=>{

const result=window.confirm(
`${message}\n\nAre you sure you want to update this order?`
);

return result;

};




const loadProducts=async()=>{

try{

const data=await getProducts();

setProducts(data.products||data);

}catch(err){

console.log(err);

}

};




const getName=(product:Product)=>{

return product.title?.en || "";

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
`Add "${getName(product)}" to this order?`
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
item.price*(item.quantity+1)

}

:item

)

);



}else{


setItems([

...items,

{

product:product._id,

productName:getName(product),

productImage:
product.images?.[0] || "",

price,

quantity:1,

totalPrice:price

}

]);


}


setShowProducts(false);


};





const updateQty=(index:number,type:"inc"|"dec")=>{


if(
!askPermission(
"Change product quantity?"
)
){

return;

}




const data=[...items];


let qty=data[index].quantity;



if(type==="inc"){

qty++;

}



if(type==="dec" && qty>1){

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
`Remove "${items[index].productName}" from this order?`
)
){

return;

}



const data=[...items];

data.splice(index,1);

setItems(data);


};


const total=items.reduce(
(sum,item)=>
sum+(item.totalPrice||0),
0
);


const filtered=products.filter(product=>

getName(product)
.toLowerCase()
.includes(search.toLowerCase())

);



return(

<div className="bg-white border rounded-xl shadow-sm">



<div className="p-4 border-b flex justify-between items-center">


<h2 className="font-bold text-lg">
Order Items
</h2>



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

className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"

>

<Plus size={16}/>

Add Product

</button>


</div>

<div className="overflow-x-auto">


<table className="w-full text-sm">


<thead className="bg-gray-50">


<tr>


<th className="p-3 text-left">
Product
</th>


<th>
Price
</th>


<th>
Qty
</th>


<th>
Total
</th>
<th>
Action
</th>


</tr>

</thead>

<tbody>

{
items.map((item,index)=>(

<tr 
key={index}
className="border-t"
>

<td className="p-3 flex gap-3 items-center">

<img

src={item.productImage}

className="w-12 h-12 rounded object-cover"

/>

<div>

<p className="font-semibold">
{item.productName}
</p>


</div>


</td>

<td className="text-center">

৳{item.price}

</td>

<td>

<div className="flex justify-center gap-2">

<button

disabled={locked}

onClick={()=>updateQty(index,"dec")}

className="border p-1 rounded"

>

<Minus size={14}/>

</button>

<span>

{item.quantity}

</span>

<button

disabled={locked}

onClick={()=>updateQty(index,"inc")}

className="border p-1 rounded"

>

<Plus size={14}/>

</button>

</div>


</td>

<td className="text-center font-bold text-green-600">

৳{item.totalPrice}

</td>

<td className="text-center">


<button

disabled={locked}

onClick={()=>removeItem(index)}

className="text-red-500"

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

<div className="p-4 border-t flex justify-between">


<span>

Total Items:
<b>{items.length}</b>

</span>

<b className="text-green-600 text-lg">

৳{total}

</b>

</div>

{
showProducts &&


<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">


<div className="bg-white w-[500px] max-h-[600px] overflow-y-auto rounded-xl p-5">

<div className="flex justify-between mb-4">


<h3 className="font-bold">

Select Product

</h3>

<button
onClick={()=>setShowProducts(false)}
>

<X/>

</button>

</div>

<div className="flex items-center border rounded-lg px-2 mb-3">

<Search size={18}/>

<input

className="w-full p-2 outline-none"

placeholder="Search product"

value={search}

onChange={
e=>setSearch(e.target.value)
}

/>


</div>

{
filtered.map(product=>(
<div

key={product._id}

onClick={()=>addProduct(product)}

className="flex gap-3 border rounded-lg p-3 mb-2 cursor-pointer"


>
<img

src={product.images?.[0]}

className="w-12 h-12 rounded"

/>

<div>
<p className="font-semibold">

{getName(product)}

</p>
<p>

৳{getProductPrice(product)}

</p>
</div>
</div>
))

}

</div>
</div>
}
</div>
);
}
