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