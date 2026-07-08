import api from "./api";


// ADMIN GET ALL PRODUCTS
export const getProducts = async () => {

  const response =
    await api.get(
      "/products/admin/all"
    );

  return response.data;

};



// GET SINGLE PRODUCT
export const getProductById = async (
 id:string
)=>{

 const response =
 await api.get(
  `/products/${id}`
 );

 return response.data;

};



// CREATE PRODUCT
export const createProduct = async (
 data:any
)=>{

 const response =
 await api.post(
  "/products",
  data
 );

 return response.data;

};



// UPDATE PRODUCT
export const updateProduct = async (
 id:string,
 data:any
)=>{

 const response =
 await api.patch(
  `/products/${id}`,
  data
 );

 return response.data;

};



// ⭐ PRODUCT ON OFF
export const toggleProductStatus = async (
 id:string,
 status:boolean
)=>{

 const response =
 await api.patch(
  `/products/${id}`,
  {
    isActive:status
  }
 );

 return response.data;

};



// DELETE PRODUCT
export const deleteProduct = async (
 id:string
)=>{

 const response =
 await api.delete(
  `/products/${id}`
 );

 return response.data;

};