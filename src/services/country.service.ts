import api from "./api";

// =========================
// GET ALL COUNTRIES
// =========================

export const getCountries = async () => {
  const res = await api.get("/countries");

  return res.data;
};


// =========================
// GET SINGLE COUNTRY
// =========================

export const getCountry = async (
  id: string,
) => {
  const res = await api.get(
    `/countries/${id}`,
  );

  return res.data;
};


// =========================
// CREATE COUNTRY
// =========================

export const createCountry = async (
  data: {
    name: string;
    code: string;
    flag: string;
  },
) => {
  const res = await api.post(
    "/countries",
    data,
  );

  return res.data;
};


// =========================
// UPDATE COUNTRY
// =========================

export const updateCountry = async (
  id: string,
  data: {
    name: string;
    code: string;
    flag: string;
  },
) => {
  const res = await api.patch(
    `/countries/${id}`,
    data,
  );

  return res.data;
};


// =========================
// DELETE COUNTRY
// =========================

export const deleteCountry = async (
  id: string,
) => {
  const res = await api.delete(
    `/countries/${id}`,
  );

  return res.data;
};