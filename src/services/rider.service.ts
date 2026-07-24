import api from "./api";

export const getRiders = async () => {
  const token = localStorage.getItem("token");

  const res = await api.get("/riders", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const createRider = async (data: {
  name: string;
  phone: string;
  password: string;
}) => {
  const token = localStorage.getItem("token");

  const res = await api.post(
    "/riders",
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};