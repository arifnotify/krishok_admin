import api from "./api";

export const getUsers = async () => {
  const response =
    await api.get("/users");

  return response.data;
};

export const getUserById =
  async (id: string) => {
    const response =
      await api.get(
        `/users/${id}`,
      );

    return response.data;
  };

export const blockUser =
  async (
    phone: string,
    reason: string,
  ) => {
    const response =
      await api.patch(
        "/users/block",
        {
          phone,
          reason,
        },
      );

    return response.data;
  };

export const unblockUser =
  async (phone: string) => {
    const response =
      await api.patch(
        "/users/unblock",
        {
          phone,
        },
      );

    return response.data;
  };