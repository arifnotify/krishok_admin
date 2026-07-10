"use client";

import { useEffect, useState } from "react";

import {
  getMainCategories,
  getSubCategories,
} from "@/src/services/category.service";

import {
  getLocations,
} from "@/src/services/location.service";

import { Category } from "@/src/types/category";

import {
  uploadImages,
} from "@/src/services/upload.service";

import {
  createProduct,
} from "@/src/services/product.service";


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


/*
 NEW
 location array
*/
const [locations,setLocations]=useState<string[]>([]);


const [mainCategory,setMainCategory]=useState("");

const [category,setCategory]=useState("");


const [images,setImages]=useState<string[]>([]);


const [categories,setCategories]=useState<Category[]>([]);

const [subCategories,setSubCategories]=useState<Category[]>([]);



const [locationList,setLocationList]=useState<any[]>([]);


const [loading,setLoading]=useState(false);



useEffect(()=>{


const loadData=async()=>{

try{


const main =
await getMainCategories();


setCategories(main);



const loc =
await getLocations();


setLocationList(loc);



}catch(err){

console.log(err);

}


};


loadData();


},[]);



const fetchSubCategories=
async(parentId:string)=>{


try{

const data =
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


const values =
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


const res =
await uploadImages(files);



const urls =
res.map(
(item:any)=>item.url
);



setImages(urls);



}catch(err){

console.log(err);

alert("Upload Failed");


}finally{


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



window.location.href =
"/dashboard/products";



}catch(err){


console.log(err);


alert(
"Create Failed"
);



}finally{


setLoading(false);


}


};




return (

<div className="max-w-[1000px] mx-auto p-6">


<div className="bg-white rounded-3xl shadow p-8">



<h1 className="text-3xl font-bold mb-8">
Create Product
</h1>




<div className="space-y-6">



{/* TITLE */}

<div className="grid grid-cols-2 gap-4">


<input

className="border rounded-2xl px-5 py-3.5"

placeholder="Title English"

value={titleEn}

onChange={
e=>setTitleEn(e.target.value)
}

/>



<input

className="border rounded-2xl px-5 py-3.5"

placeholder="পণ্যের নাম বাংলা"

value={titleBn}

onChange={
e=>setTitleBn(e.target.value)
}

/>


</div>





{/* DESCRIPTION */}


<div className="grid grid-cols-2 gap-4">


<textarea

className="border rounded-2xl px-5 py-3 h-32"

placeholder="Description English"

value={descriptionEn}

onChange={
e=>setDescriptionEn(e.target.value)
}

/>



<textarea

className="border rounded-2xl px-5 py-3 h-32"

placeholder="বিবরণ বাংলা"

value={descriptionBn}

onChange={
e=>setDescriptionBn(e.target.value)
}

/>


</div>






{/* CATEGORY */}


<div className="grid grid-cols-2 gap-5">


<select

value={mainCategory}

onChange={handleMainCategory}

className="border rounded-2xl px-5 py-3.5"

>


<option value="">
Main Category
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

className="border rounded-2xl px-5 py-3.5"

>


<option value="">
Sub Category
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





{/* YOUTUBE */}


<input

className="border rounded-2xl px-5 py-3.5 w-full"

placeholder="Youtube Video URL"

value={youtubeVideoUrl}

onChange={
e=>setYoutubeVideoUrl(e.target.value)
}

/>





{/* PRICE */}


<div className="grid grid-cols-2 gap-5">


<input

type="number"

className="border rounded-2xl px-5 py-3.5"

placeholder="Price"

value={price}

onChange={
e=>setPrice(e.target.value)
}

/>




<input

type="number"

className="border rounded-2xl px-5 py-3.5"

placeholder="Discount Price"

value={discountPrice}

onChange={
e=>setDiscountPrice(e.target.value)
}

/>


</div>




{/* STOCK BRAND */}


<div className="grid grid-cols-2 gap-5">


<input

type="number"

className="border rounded-2xl px-5 py-3.5"

placeholder="Stock"

value={stock}

onChange={
e=>setStock(e.target.value)
}

/>




<input

className="border rounded-2xl px-5 py-3.5"

placeholder="Brand"

value={brand}

onChange={
e=>setBrand(e.target.value)
}

/>


</div>




{/* UNIT */}


<input

className="border rounded-2xl px-5 py-3.5 w-full"

placeholder="Unit"

value={unit}

onChange={
e=>setUnit(e.target.value)
}

/>





{/* PRODUCT TYPE */}


<select

className="border rounded-2xl px-5 py-3.5 w-full"

value={productType}

onChange={
e=>setProductType(e.target.value)
}

>


<option value="regular">
Regular Product
</option>


<option value="fresh">
Fresh Product
</option>


</select>





{
productType==="regular" &&


<input

type="date"

className="border rounded-2xl px-5 py-3.5 w-full"

value={expiryDate}

onChange={
e=>setExpiryDate(e.target.value)
}

/>


}






{/* LOCATION NEW */}



<select

multiple

value={locations}

onChange={handleLocationChange}

className="border rounded-2xl px-5 py-3.5 w-full h-32"

>


<option value="">
Select Location
</option>



{

locationList.map(item=>(


<option

key={item._id}

value={item._id}

>


{item.name}


</option>


))


}



</select>





{/* IMAGE */}


<input

type="file"

multiple

onChange={handleUpload}

/>





<div className="flex gap-4 flex-wrap">


{

images.map((img,i)=>(


<img

key={i}

src={img}

className="w-24 h-24 rounded-xl object-cover"

/>


))


}



</div>





<button

onClick={handleCreate}

disabled={loading}

className="bg-blue-600 text-white px-8 py-3 rounded-2xl"

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


);


}