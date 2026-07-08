import api from "./api";

// GET ALL FLASH SALES
export const getFlashSales =
  async () => {
    const res =
      await api.get(
        "/flash-sale/admin/all",
      );

    return res.data;
  };

// CREATE FLASH SALE
export const createFlashSale =
  async (data: any) => {
    const res =
      await api.post(
        "/flash-sale",
        data,
      );

    return res.data;
  };

// DELETE FLASH SALE
export const deleteFlashSale =
  async (id: string) => {
    const res =
      await api.delete(
        `/flash-sale/${id}`,
      );

    return res.data;
  };

// EXPIRE SALES
export const expireFlashSales =
  async () => {
    const res =
      await api.post(
        "/flash-sale/expire",
      );

    return res.data;
  };

  // SINGLE FLASH SALE
export const getFlashSaleById =
  async (id: string) => {
    const res =
      await api.get(
        `/flash-sale/${id}`,
      );

    return res.data;
  };


// UPDATE
export const updateFlashSale =
  async (
    id: string,
    data: any,
  ) => {
    const res =
      await api.patch(
        `/flash-sale/${id}`,
        data,
      );

    return res.data;
  };