import api from "./api";

// GET PRODUCTS (LIST)
export const getProducts = async () => {
  const response = await api.get("/products");
  return response.data;
};

// GET SINGLE PRODUCT (EDIT PAGE)
export const getProductById = async (id: string) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

// CREATE PRODUCT
export const createProduct = async (data: any) => {
  const response = await api.post("/products", data);
  return response.data;
};

// UPDATE PRODUCT (EDIT SAVE)
export const updateProduct = async (id: string, data: any) => {
  const response = await api.patch(`/products/${id}`, data);
  return response.data;
};

// DELETE PRODUCT
export const deleteProduct = async (id: string) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};