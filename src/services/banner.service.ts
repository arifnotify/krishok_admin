import api from "./api";

// GET ALL
export const getBanners =
  async () => {
    const res =
      await api.get(
        "/banners",
      );

    return res.data;
  };

// GET ONE
export const getBannerById =
  async (id: string) => {
    const res =
      await api.get(
        `/banners/${id}`,
      );

    return res.data;
  };

// CREATE
export const createBanner =
  async (data: any) => {
    const res =
      await api.post(
        "/banners",
        data,
      );

    return res.data;
  };

// UPDATE
export const updateBanner =
  async (
    id: string,
    data: any,
  ) => {
    const res =
      await api.patch(
        `/banners/${id}`,
        data,
      );

    return res.data;
  };

// DELETE
export const deleteBanner =
  async (id: string) => {
    const res =
      await api.delete(
        `/banners/${id}`,
      );

    return res.data;
  };