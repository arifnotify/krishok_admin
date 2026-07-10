"use client";

import { useEffect,useState } from "react";
import { useParams } from "next/navigation";

import {
getProductById,
updateProduct,
} from "@/src/services/product.service";

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

import { Category } from "@/src/types/category";
import { Location } from "@/src/types/location";

export default function EditProductPage(){

const { id } = useParams();

const [titleEn,setTitleEn]=useState("");
const [titleBn,setTitleBn]=useState("");

const [descriptionEn,setDescriptionEn]=useState("");
const [descriptionBn,setDescriptionBn]=useState("");

const [youtubeVideoUrl,setYoutubeVideoUrl]=
useState("");

const [price,setPrice]=useState("");

const [discountPrice,setDiscountPrice]=
useState("");

const [stock,setStock]=useState("");

const [brand,setBrand]=useState("");

const [unit,setUnit]=useState("pcs");

const [productType,setProductType]=
useState("regular");

const [expiryDate,setExpiryDate]=
useState("");

const [locations,setLocations]=
useState<string[]>([]);

const [mainCategory,setMainCategory]=
useState("");

const [category,setCategory]=
useState("");

const [images,setImages]=
useState<string[]>([]);

const [categories,setCategories]=
useState<Category[]>([]);

const [subCategories,setSubCategories]=
useState<Category[]>([]);

const [locationList,setLocationList]=
useState<Location[]>([]);

const [loading,setLoading]=
useState(false);

const [pageLoading,setPageLoading]=
useState(true);

useEffect(()=>{

loadData();

},[]);

const loadData=async()=>{

try{

const [
product,
categoryData,
locationsData,
]=await Promise.all([

getProductById(id as string),

getMainCategories(),

getLocations(),

]);

setCategories(categoryData);

setLocationList(

Array.isArray(locationsData)
?
locationsData
:
locationsData.data || []

);

setTitleEn(
product.title?.en || ""
);

setTitleBn(
product.title?.bn || ""
);

setDescriptionEn(
product.description?.en || ""
);

setDescriptionBn(
product.description?.bn || ""
);

setYoutubeVideoUrl(
product.youtubeVideoUrl || ""
);

setPrice(
String(product.price || "")
);

setDiscountPrice(
String(product.discountPrice || "")
);

setStock(
String(product.stock || "")
);

setBrand(
product.brand || ""
);

setUnit(
product.unit || "pcs"
);

setProductType(
product.productType || "regular"
);

setImages(
product.images || []
);

setCategory(
product.category?._id || ""
);

setLocations(

product.locations?.map(
(loc:any)=>
typeof loc==="string"
?
loc
:
loc._id
) || []

);

if(product.expiryDate){

setExpiryDate(
product.expiryDate.split("T")[0]
);

}

if(product.category?.parentCategory){

setMainCategory(
product.category.parentCategory
);

const subs=
await getSubCategories(
product.category.parentCategory
);

setSubCategories(subs);

}

}catch(err){

console.log(err);

}
finally{

setPageLoading(false);

}

};
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

const handleLocationChange=(
id:string
)=>{

if(
locations.includes(id)
){

setLocations(

locations.filter(
(item)=>item!==id
)

);

}else{

setLocations([
...locations,
id
]);

}

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

const removeImage=(
img:string
)=>{

setImages(

images.filter(
(item)=>item!==img
)

);

};

const handleUpdate=
async()=>{

try{

setLoading(true);

await updateProduct(

id as string,

{

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

}

);

alert(
"Product Updated Successfully"
);

window.location.href=
"/dashboard/products";

}catch(err){

console.log(err);

alert(
"Update Failed"
);

}
finally{

setLoading(false);

}

};

if(pageLoading){

return(

<div className="p-10">

Loading Product...

</div>

);

}
return(

<div className="max-w-[1000px] mx-auto p-6">

<div className="bg-white rounded-3xl shadow p-8">

<div className="flex items-center gap-4 mb-10">

<div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
✏️
</div>

<div>

<h1 className="text-3xl font-bold">
Edit Product
</h1>

<p className="text-gray-500">
Update product information
</p>

</div>

</div>

<div className="space-y-7">

{/* TITLE */}

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

{/* DESCRIPTION */}

<div className="grid grid-cols-2 gap-4">

<textarea
placeholder="Description English"
value={descriptionEn}
onChange={
e=>setDescriptionEn(
e.target.value
)
}
className="border rounded-2xl px-5 py-3 h-32"
/>

<textarea
placeholder="বিবরণ বাংলা"
value={descriptionBn}
onChange={
e=>setDescriptionBn(
e.target.value
)
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
e=>setCategory(
e.target.value
)
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

{/* YOUTUBE */}

<div>

<label className="block text-sm font-medium mb-2">
Youtube Video URL
</label>

<input
type="text"
placeholder="https://youtube.com/..."
value={youtubeVideoUrl}
onChange={
e=>
setYoutubeVideoUrl(
e.target.value
)
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
e=>
setDiscountPrice(
e.target.value
)
}
className="border rounded-2xl px-5 py-3.5"
/>

</div>

{/* STOCK + BRAND */}

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
e=>
setProductType(
e.target.value
)
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

{
productType==="regular" && (

<input
type="date"
value={expiryDate}
onChange={
e=>
setExpiryDate(
e.target.value
)
}
className="w-full border rounded-2xl px-5 py-3.5"
/>

)
}
{/* LOCATIONS */}

<div>

<label className="block text-sm font-medium mb-3">
Available Locations
</label>

<div className="grid grid-cols-3 gap-3">

{
locationList.map((location)=>(

<label
key={location._id}
className="
flex
items-center
gap-3
border
rounded-xl
p-3
cursor-pointer
hover:bg-gray-50
"
>

<input
type="checkbox"
checked={
locations.includes(
location._id
)
}
onChange={()=>
handleLocationChange(
location._id
)
}
/>

<div>

<p className="font-medium">
{location.district}
</p>

<p className="text-xs text-gray-500">
{location.division}
</p>

</div>

</label>

))
}

</div>

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
onClick={()=>
removeImage(img)
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

{/* BUTTONS */}

<div className="flex justify-end gap-4 mt-10">

<button
type="button"
onClick={()=>
window.history.back()
}
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
onClick={handleUpdate}
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
"Updating..."
:
"Update Product"
}

</button>

</div>

</div>

</div>

</div>

);

}
