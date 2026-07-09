"use client";

import { useState } from "react";
import { Plus, Minus, Trash2, Search, X } from "lucide-react";
import { getProducts } from "@/src/services/product.service";

interface Product {
  _id: string;
  title: string | { en: string; bn?: string };
  price: number;
  discountPrice?: number;
  images: string[];
}

interface Props {
  items: any[];
  setItems: (items: any[]) => void;
  locked: boolean;
}

export default function EditableOrderItems({
  items,
  setItems,
  locked,
}: Props) {

  const [showProducts,setShowProducts] = useState(false);
  const [products,setProducts] = useState<Product[]>([]);
  const [search,setSearch] = useState("");

  const loadProducts = async()=>{
    try{
      const data = await getProducts();
      setProducts(data.products || data);
    }catch(err){
      console.log(err);
    }
  };

  const getName=(p:Product)=>{
    return typeof p.title==="object" ? p.title.en : p.title;
  };

  const addProduct=(product:Product)=>{

    const price =
      product.discountPrice && product.discountPrice > 0
      ? product.discountPrice
      : product.price;

    const exist = items.find(
      i=>i.product===product._id
    );

    if(exist){

      setItems(
        items.map(i=>
          i.product===product._id
          ? {
              ...i,
              quantity:i.quantity+1,
              totalPrice:i.price*(i.quantity+1)
            }
          : i
        )
      );

    }else{

      setItems([
        ...items,
        {
          product:product._id,
          productName:getName(product),
          productImage:product.images?.[0],
          price,
          quantity:1,
          totalPrice:price
        }
      ]);

    }

    setShowProducts(false);
  };


  const updateQty=(index:number,type:"inc"|"dec")=>{

    const updated=[...items];

    let qty=updated[index].quantity;

    if(type==="inc") qty++;
    if(type==="dec" && qty>1) qty--;

    updated[index]={
      ...updated[index],
      quantity:qty,
      totalPrice:updated[index].price*qty
    };

    setItems(updated);
  };


  const removeItem=(index:number)=>{
    const updated=[...items];
    updated.splice(index,1);
    setItems(updated);
  };


  const total=items.reduce(
    (sum,i)=>sum+(i.totalPrice||0),
    0
  );


  const filtered =
    products.filter(p=>
      getName(p)
      .toLowerCase()
      .includes(search.toLowerCase())
    );


return (
<div className="bg-white border rounded-2xl shadow-sm overflow-hidden">

<div className="p-5 border-b flex justify-between items-center">
<h2 className="text-xl font-bold">Order Items</h2>

<div className="flex gap-3">

<button
disabled={locked}
onClick={()=>{
setShowProducts(true);
loadProducts();
}}
className="bg-green-600 text-white px-4 py-2 rounded-lg flex gap-2 items-center"
>
<Plus size={16}/> Add Product
</button>

{locked &&
<span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs">
Locked
</span>
}

</div>
</div>


<div className="overflow-x-auto">
<table className="w-full text-sm">

<thead className="bg-gray-50">
<tr>
<th className="p-4 text-left">Item</th>
<th>Price</th>
<th>Qty</th>
<th>Total</th>
<th className="p-4">Action</th>
</tr>
</thead>


<tbody>

{items.map((item,index)=>(

<tr key={index} className="border-t">

<td className="p-4 flex gap-3 items-center">

<img
src={item.productImage}
className="w-12 h-12 rounded object-cover"
/>

<div>
<p className="font-semibold">
{item.productName}
</p>
<p className="text-xs text-gray-500">
ID: {item.product}
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


<td className="text-center text-green-600 font-bold">
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

))}

</tbody>

</table>
</div>


<div className="p-5 border-t flex justify-between">
<p>
Total Items: <b>{items.length}</b>
</p>

<p className="text-green-600 font-bold text-lg">
৳{total}
</p>
</div>



{showProducts &&

<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

<div className="bg-white w-[500px] max-h-[600px] overflow-y-auto rounded-xl p-5">

<div className="flex justify-between mb-4">
<h3 className="font-bold">
Select Product
</h3>

<button onClick={()=>setShowProducts(false)}>
<X/>
</button>
</div>


<div className="flex items-center border rounded-lg px-3 mb-3">
<Search size={18}/>

<input
className="p-2 w-full outline-none"
placeholder="Search..."
value={search}
onChange={e=>setSearch(e.target.value)}
/>

</div>


{filtered.map(product=>(

<div
key={product._id}
onClick={()=>addProduct(product)}
className="flex gap-3 items-center p-3 border rounded-lg mb-2 cursor-pointer"
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
৳{product.discountPrice || product.price}
</p>

</div>

</div>

))}


</div>

</div>

}

</div>
);
}