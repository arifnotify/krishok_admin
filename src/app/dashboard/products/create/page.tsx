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

import { Location } from "@/src/types/location";


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


const [productType,setProductType]=useState(
"regular"
);


const [expiryDate,setExpiryDate]=useState("");



const [locations,setLocations]=useState<string[]>([]);


const [mainCategory,setMainCategory]=useState("");

const [category,setCategory]=useState("");



const [images,setImages]=useState<string[]>([]);



const [categories,setCategories]=useState<Category[]>([]);

const [subCategories,setSubCategories]=useState<Category[]>([]);



const [locationList,setLocationList]=useState<Location[]>([]);



const [loading,setLoading]=useState(false);



useEffect(()=>{

const loadData=async()=>{

try{


const categoryData =
await getMainCategories();


setCategories(categoryData);



const locationsData =
await getLocations();


setLocationList(
Array.isArray(locationsData)
?
locationsData
:
locationsData.data || []
);



}catch(err){

console.log(err);

}

};


loadData();


},[]);




const fetchSubCategories=
async(parentId:string)=>{

try{

const data=
await getSubCategories(parentId);

setSubCategories(data);


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

await fetchSubCategories(value);

}


};





const handleLocationChange=
(
e:React.ChangeEvent<HTMLSelectElement>
)=>{


const values=
Array.from(
e.target.selectedOptions,
(option)=>option.value
);



setLocations(values);


};






const handleUpload=
async(
e:React.ChangeEvent<HTMLInputElement>
)=>{


const files=e.target.files;


if(!files)return;



try{


setLoading(true);


const res=
await uploadImages(files);



const urls=
res.map(
(item:any)=>item.url
);



setImages(
prev=>[
...prev,
...urls
]
);



}catch(err){

console.log(err);

alert(
"Upload Failed"
);


}
finally{

setLoading(false);

}


};






const removeImage=(img:string)=>{

setImages(
images.filter(
(item)=>item!==img
)
);

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
Number(discountPrice)
||
undefined,



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



window.location.href=
"/dashboard/products";



}catch(err){


console.log(err);


alert(
"Create Failed"
);


}
finally{

setLoading(false);

}


};




return (

<div className="max-w-[1000px] mx-auto p-6">

<div className="bg-white rounded-3xl shadow p-8">


<div className="flex items-center gap-4 mb-10">

<div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
📦
</div>


<div>

<h1 className="text-3xl font-bold">
Create Product
</h1>


<p className="text-gray-500">
Add new product to inventory
</p>


</div>


</div>



<div className="space-y-7">



<div className="grid grid-cols-2 gap-4">


<input
type="text"
placeholder="Product Title English"
value={titleEn}
onChange={
e=>setTitleEn(e.target.value)
}
className="border rounded-2xl px-5 py-3.5"
/>



<input
type="text"
placeholder="পণ্যের নাম বাংলা"
value={titleBn}
onChange={
e=>setTitleBn(e.target.value)
}
className="border rounded-2xl px-5 py-3.5"
/>


</div>



<div className="grid grid-cols-2 gap-4">


<textarea

placeholder="Description English"

value={descriptionEn}

onChange={
e=>setDescriptionEn(e.target.value)
}

className="border rounded-2xl px-5 py-3 h-32"
/>



<textarea

placeholder="বিবরণ বাংলা"

value={descriptionBn}

onChange={
e=>setDescriptionBn(e.target.value)
}

className="border rounded-2xl px-5 py-3 h-32"
/>


</div>
{/* CATEGORY */}

<div className="grid grid-cols-2 gap-6">

<div>

<label className="block text-sm font-medium mb-2">
Main Category
</label>


<select
value={mainCategory}
onChange={handleMainCategory}
className="w-full border rounded-2xl px-5 py-3.5"
>


<option value="">
Select Category
</option>


{
categories.map((item)=>(
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




<div>

<label className="block text-sm font-medium mb-2">
Sub Category
</label>


<select

value={category}

onChange={
e=>setCategory(e.target.value)
}

className="w-full border rounded-2xl px-5 py-3.5"

>


<option value="">
Select SubCategory
</option>



{
subCategories.map((item)=>(
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


</div>





{/* Youtube */}

<div>

<label className="block text-sm font-medium mb-2">
Youtube Video URL
</label>


<input

type="text"

placeholder="https://youtube.com/..."

value={youtubeVideoUrl}

onChange={
e=>setYoutubeVideoUrl(e.target.value)
}

className="w-full border rounded-2xl px-5 py-3.5"

/>


</div>





{/* PRICE */}


<div className="grid grid-cols-2 gap-6">


<input

type="number"

placeholder="Price"

value={price}

onChange={
e=>setPrice(e.target.value)
}

className="border rounded-2xl px-5 py-3.5"

/>




<input

type="number"

placeholder="Discount Price"

value={discountPrice}

onChange={
e=>setDiscountPrice(e.target.value)
}

className="border rounded-2xl px-5 py-3.5"

/>


</div>





{/* STOCK BRAND */}


<div className="grid grid-cols-2 gap-6">


<input

type="number"

placeholder="Stock"

value={stock}

onChange={
e=>setStock(e.target.value)
}

className="border rounded-2xl px-5 py-3.5"

/>



<input

type="text"

placeholder="Brand"

value={brand}

onChange={
e=>setBrand(e.target.value)
}

className="border rounded-2xl px-5 py-3.5"

/>


</div>





{/* UNIT */}


<input

type="text"

placeholder="kg / gm / pcs / liter"

value={unit}

onChange={
e=>setUnit(e.target.value)
}

className="w-full border rounded-2xl px-5 py-3.5"

/>





{/* PRODUCT TYPE */}


<select

value={productType}

onChange={
e=>setProductType(e.target.value)
}

className="w-full border rounded-2xl px-5 py-3.5"

>


<option value="regular">
Regular Product
</option>


<option value="fresh">
Fresh Product
</option>


</select>





{/* EXPIRY */}


{
productType==="regular" &&

<input

type="date"

value={expiryDate}

onChange={
e=>setExpiryDate(e.target.value)
}

className="w-full border rounded-2xl px-5 py-3.5"

/>

}






{/* LOCATION */}


<div>


<label className="block text-sm font-medium mb-2">

Location

</label>



<select

multiple

value={locations}

onChange={handleLocationChange}

className="
w-full
h-44
border
rounded-2xl
px-5
py-3
bg-white
text-black
font-medium
outline-none
focus:border-blue-500
"

>


<option value="">
Select Location
</option>



{
locationList.map((item)=>(
<option

key={item._id}

value={item._id}

className="text-black bg-white"

>

{item.division} - {item.district}

</option>
))
}



</select>



<p className="text-xs text-gray-500 mt-2">
Multiple location select করতে Ctrl চাপুন
</p>


</div>







{/* IMAGE UPLOAD */}


<div>


<label className="block text-sm font-medium mb-3">
Upload Images
</label>



<input

type="file"

multiple

onChange={handleUpload}

/>




<div className="flex gap-4 flex-wrap mt-5">


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
object-cover
rounded-2xl
border
"

/>



<button

type="button"

onClick={
()=>removeImage(img)
}

className="
absolute
top-1
right-1
bg-red-500
text-white
rounded-full
w-6
h-6
"

>

×

</button>



</div>


))

}


</div>



</div>







{/* BUTTON */}



<div className="flex justify-end gap-4 mt-10">


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