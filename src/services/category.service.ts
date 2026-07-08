import api from "./api";

// GET ALL
export const getCategories =
  async () => {
    const res =
      await api.get(
        "/categories",
      );

    return res.data;
  };

// GET ONE
export const getCategory =
  async (
    id: string,
  ) => {
    const res =
      await api.get(
        `/categories/${id}`,
      );

    return res.data;
  };

// CREATE
export const createCategory =
  async (data: any) => {
    const res =
      await api.post(
        "/categories",
        data,
      );

    return res.data;
  };

// UPDATE
export const updateCategory =
  async (
    id: string,
    data: any,
  ) => {
    const res =
      await api.patch(
        `/categories/${id}`,
        data,
      );

    return res.data;
  };

// DELETE
export const deleteCategory =
  async (
    id: string,
  ) => {
    const res =
      await api.delete(
        `/categories/${id}`,
      );

    return res.data;
  };

// MAIN
export const getMainCategories =
  async () => {
    const res =
      await api.get(
        "/categories/main",
      );

    return res.data;
  };

// SUB
export const getSubCategories =
  async (
    parentId: string,
  ) => {
    const res =
      await api.get(
        `/categories/subcategories/${parentId}`,
      );

    return res.data;
  };