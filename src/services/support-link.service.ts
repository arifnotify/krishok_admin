import api from "./api";

// GET
export const getSupportLinks = async () => {
  const res = await api.get("/support-links");
  return res.data;
};

// UPDATE
export const updateSupportLinks = async (
  data: any,
) => {
  const { _id, createdAt, updatedAt, __v, ...cleanData } =
    data;

  const res = await api.patch(
    "/support-links",
    cleanData,
  );

  return res.data;
};