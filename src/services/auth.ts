import api from "./api";

export const loginAdmin = async (
  email: string,
  password: string
) => {
  const res = await api.post("/admin/login", {
    email,
    password,
  });

  return res.data;
};