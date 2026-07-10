"use client";

import { useState } from "react";
import {
  Plus,
  Minus,
  Trash2,
  Search,
  X
} from "lucide-react";

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


return window.confirm(

`${message}\n\nAre you sure you want to update this order?`

);


};







const loadProducts=async()=>{


try{


const data:any=await getProducts();


setProducts(
data.products || data
);


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

product.flashSalePrice

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

`Add "${getName(product)}" to order?`

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



}else{



setItems([

...items,

{

product:product._id,

productName:getName(product),

productImage:product.images?.[0] || "",

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

"Change quantity?"

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

`Remove ${items[index].productName}?`

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

sum+(item.totalPrice||0),

0

);






const filtered=

products.filter(product=>

getName(product)

.toLowerCase()

.includes(

search.toLowerCase()

)

);



return (

<div className="bg-white border rounded-xl overflow-hidden">


{/* HEADER */}

<div className="p-5 border-b flex justify-between items-center">


<h2 className="text-lg font-semibold">

Order Details

</h2>




<button

disabled={locked}

onClick={()=>{


if(

askPermission(

"Add new product?"

)

){

setShowProducts(true);

loadProducts();

}

}}

className="

border

px-4

py-2

rounded-lg

text-sm

flex

items-center

gap-2

hover:bg-gray-50

"

>

<Plus size={16}/>

Add Item

</button>



</div>





{/* TABLE */}

<div className="overflow-x-auto">


<table className="w-full text-sm">


<thead className="bg-gray-50">


<tr className="border-b">


<th className="p-4 text-left">

Product

</th>



<th className="p-4 text-center">

Qty

</th>



<th className="p-4 text-right">

Price

</th>



<th className="p-4 text-right">

Total

</th>



<th className="p-4">

Action

</th>



</tr>


</thead>



<tbody>
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

<td className="p-4">


<div className="flex items-center gap-4">


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


<p className="font-semibold text-gray-800">

{item.productName}

</p>



{
item.barcode &&

<p className="text-xs text-gray-500">

Barcode: {item.barcode}

</p>

}



</div>



</div>


</td>





{/* QTY */}

<td className="p-4">


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
rounded
p-1
hover:bg-gray-100
"

>

<Minus size={14}/>

</button>




<span className="
font-semibold
min-w-[25px]
text-center
">

{item.quantity}

</span>





<button

disabled={locked}

onClick={()=>updateQty(index,"inc")}

className="
border
rounded
p-1
hover:bg-gray-100
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
font-semibold
">


QAR {Number(item.totalPrice).toFixed(2)}


</td>







{/* ACTION */}

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





{/* FOOTER TOTAL */}

<div className="
border-t
p-5
flex
justify-between
items-center
">


<div className="text-sm text-gray-600">


Total Items:

<b className="ml-2">

{items.length}

</b>


</div>





<div className="
text-xl
font-bold
">


QAR {total.toFixed(2)}


</div>


</div>









{/* PRODUCT SELECT MODAL */}


{
showProducts && (


<div className="
fixed
inset-0
bg-black/40
flex
items-center
justify-center
z-50
">



<div className="
bg-white
w-[520px]
max-h-[650px]
rounded-xl
p-5
overflow-y-auto
">





<div className="
flex
justify-between
items-center
mb-5
">


<h3 className="font-bold text-lg">

Select Product

</h3>



<button

onClick={()=>setShowProducts(false)}

>

<X/>

</button>



</div>







<div className="
border
rounded-lg
flex
items-center
px-3
mb-4
">


<Search size={18}/>


<input

className="
w-full
p-2
outline-none
"

placeholder="Search product..."

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

className="
flex
items-center
gap-4
border
rounded-lg
p-3
mb-3
cursor-pointer
hover:bg-gray-50
"


>



<img

src={
product.images?.[0] ||
"/placeholder.png"
}

className="
w-14
h-14
rounded-lg
object-cover
border
"

/>





<div>


<p className="
font-semibold
">

{getName(product)}

</p>




<p className="text-sm text-gray-600">

QAR {getProductPrice(product).toFixed(2)}

</p>



</div>




</div>



))


}







</div>



</div>


)


}



</div>

);

}
