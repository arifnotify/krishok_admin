"use client";

import { useEffect, useState } from "react";

import {
  getMainCategories,
  getSubCategories,
} from "@/src/services/category.service";

import {
  getLocations,
} from "@/src/services/location.service";

import {
  uploadImages,
} from "@/src/services/upload.service";

import {
  createProduct,
} from "@/src/services/product.service";

import { Category } from "@/src/types/category";


export default function CreateProductPage(){

const [titleEn,setTitleEn]=useState("");
const [titleBn,setTitleBn]=useState("");

const [descriptionEn,setDescriptionEn]=useState("");
const [descriptionBn,setDescriptionBn]=useState("");

const [youtubeVideoUrl,setYoutubeVideoUrl]=useState("");

const [price,setPrice]=useState("");
const [discountPrice,setDiscountPrice]=useState("");

const [stock,setStock]=useState("");

const [brand,setBrand]=useState("");

const [unit,setUnit]=useState("pcs");

const [productType,setProductType]=useState("regular");

const [expiryDate,setExpiryDate]=useState("");


const [locations,setLocations]=useState<string[]>([]);

const [locationList,setLocationList]=useState<any[]>([]);


const [mainCategory,setMainCategory]=useState("");

const [category,setCategory]=useState("");

const [categories,setCategories]=useState<Category[]>([]);

const [subCategories,setSubCategories]=useState<Category[]>([]);


const [images,setImages]=useState<string[]>([]);


const [loading,setLoading]=useState(false);



useEffect(()=>{

loadData();

},[]);



const loadData=async()=>{

try{


const main =
await getMainCategories();

setCategories(main);



const locations =
await getLocations();


setLocationList(locations);



}catch(err){

console.log(err);

}

};





const handleMainCategory=
async(
e:React.ChangeEvent<HTMLSelectElement>
)=>{


const value=e.target.value;


setMainCategory(value);

setCategory("");

setSubCategories([]);


if(value){

const data =
await getSubCategories(value);


setSubCategories(data);

}


};





const handleLocationChange=
(
e:React.ChangeEvent<HTMLSelectElement>
)=>{


const selected =
Array.from(
e.target.selectedOptions,
(item)=>item.value
);


setLocations(selected);


};






const handleUpload=
async(
e:React.ChangeEvent<HTMLInputElement>
)=>{


const files=e.target.files;


if(!files)return;



try{


setLoading(true);


const result =
await uploadImages(files);



const urls =
result.map(
(item:any)=>item.url
);



setImages(urls);



}catch(err){

console.log(err);

alert(
"Image Upload Failed"
);


}
finally{

setLoading(false);

}


};






const handleCreate=
async()=>{


try{


setLoading(true);



await createProduct({

title:{

en:titleEn,

bn:titleBn,

},


description:{

en:descriptionEn,

bn:descriptionBn,

},



youtubeVideoUrl,



price:Number(price),



discountPrice:
Number(discountPrice)||0,



stock:Number(stock),



brand,



unit,



productType,



expiryDate:
productType==="regular"
?
expiryDate
:
undefined,



category,



locations,



images,



isActive:true,


});



alert(
"Product Created Successfully"
);



window.location.href =
"/dashboard/products";



}catch(err){

console.log(err);

alert(
"Create Product Failed"
);


}
finally{

setLoading(false);

}


};





return(

<div className="max-w-5xl mx-auto p-6">


<div className="bg-white shadow-xl rounded-3xl p-8">


<div className="mb-8">

<h1 className="text-3xl font-bold text-gray-800">

Create Product

</h1>


<p className="text-gray-500 mt-2">

Add new product to inventory

</p>


</div>





<div className="space-y-6">





{/* TITLE */}


<div className="grid grid-cols-1 md:grid-cols-2 gap-5">


<div>

<label className="font-medium">
English Title
</label>


<input

className="w-full mt-2 border rounded-xl px-4 py-3"

value={titleEn}

onChange={
e=>setTitleEn(e.target.value)
}

/>

</div>




<div>

<label className="font-medium">
বাংলা নাম
</label>


<input

className="w-full mt-2 border rounded-xl px-4 py-3"

value={titleBn}

onChange={
e=>setTitleBn(e.target.value)
}

/>

</div>


</div>






{/* DESCRIPTION */}



<div className="grid grid-cols-1 md:grid-cols-2 gap-5">


<textarea

className="border rounded-xl p-4 h-32"

placeholder="English Description"

value={descriptionEn}

onChange={
e=>setDescriptionEn(e.target.value)
}

/>



<textarea

className="border rounded-xl p-4 h-32"

placeholder="বাংলা বিবরণ"

value={descriptionBn}

onChange={
e=>setDescriptionBn(e.target.value)
}

/>


</div>






{/* CATEGORY */}


<div className="grid grid-cols-1 md:grid-cols-2 gap-5">


<select

value={mainCategory}

onChange={handleMainCategory}

className="border rounded-xl px-4 py-3 text-black bg-white"

>


<option>
Select Main Category
</option>


{
categories.map(item=>(


<option

key={item._id}

value={item._id}

>

{item.name}

</option>


))
}



</select>





<select

value={category}

onChange={
e=>setCategory(e.target.value)
}

className="border rounded-xl px-4 py-3 text-black bg-white"

>


<option>
Select Sub Category
</option>


{
subCategories.map(item=>(


<option

key={item._id}

value={item._id}

>

{item.name}

</option>


))
}


</select>


</div>
{/* LOCATION */}
<div className="flex gap-6 items-start">

<div className="w-11 h-11 bg-green-100 rounded-2xl flex items-center justify-center">
📍
</div>

<div className="flex-1">

<label className="block text-sm font-medium mb-2">
Available Locations
</label>


<div className="grid grid-cols-2 gap-3">


{locations.map((item)=>(
<label
key={item._id}
className="flex items-center gap-3 border rounded-xl p-3 cursor-pointer hover:bg-gray-50"
>

<input
type="checkbox"
checked={
selectedLocations.includes(item._id)
}
onChange={()=>toggleLocation(item._id)}
className="w-4 h-4"
/>


<span>
{item.name}
</span>


</label>
))}


</div>


<p className="text-xs text-gray-500 mt-2">
Select where this product will be available
</p>


</div>

</div>




{/* IMAGE UPLOAD */}

<div className="flex gap-6 items-start">


<div className="w-11 h-11 bg-purple-100 rounded-2xl flex items-center justify-center">
🖼️
</div>


<div className="flex-1">


<label className="block text-sm font-medium mb-3">
Product Images
</label>


<div className="border-2 border-dashed rounded-3xl p-10 text-center">


<p className="text-gray-500 mb-4">
Upload product images
</p>


<label
className="
cursor-pointer
bg-blue-600
text-white
px-6
py-3
rounded-xl
inline-block
"
>

Choose Images


<input
type="file"
multiple
hidden
onChange={handleUpload}
/>


</label>



</div>




<div className="flex flex-wrap gap-4 mt-6">


{
images.map((img,index)=>(

<div
key={index}
className="relative"
>


<img
src={img}
className="
w-24
h-24
rounded-2xl
object-cover
border
"
/>



<button

onClick={()=>
setImages(
images.filter(
(_,i)=>i!==index
)
)
}

className="
absolute
top-1
right-1
bg-red-500
text-white
w-6
h-6
rounded-full
"

>
×
</button>


</div>

))
}



</div>


</div>


</div>





{/* BUTTON */}


<div className="
flex
justify-end
gap-4
mt-12
">


<button

type="button"

className="
px-8
py-3
border
rounded-2xl
"

>
Cancel
</button>



<button

onClick={handleCreate}

disabled={loading}

className="
px-8
py-3
bg-blue-600
text-white
rounded-2xl
disabled:opacity-50
"

>


{
loading
?
"Creating..."
:
"Create Product"
}


</button>


</div>



</div>

</div>

</div>

);

}