import api from "./api";

// =========================
// TOKEN HELPER
// =========================
const getToken = () => {
  return localStorage.getItem("token");
};

// =========================
// GET ALL ORDERS
// =========================
export const getOrders = async () => {
  const res = await api.get("/orders", {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.data;
};

// =========================
// GET SINGLE ORDER
// =========================
export const getOrder = async (id: string) => {
  const res = await api.get(`/orders/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.data;
};

// =========================
// UPDATE ORDER STATUS
// =========================
export const updateOrderStatus = async (
  id: string,
  orderStatus: string
) => {
  const res = await api.patch(
    `/orders/${id}/status`,
    { orderStatus },
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return res.data;
};

// =========================
// ASSIGN RIDER
// =========================
export const assignRider = async (
  orderId: string,
  riderId: string
) => {
  const res = await api.put(
    "/orders/assign-rider",
    {
      orderId,
      riderId,
    },
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return res.data;
};

// =========================
// TRACKING
// =========================
export const getTracking = async (orderId: string) => {
  const res = await api.get(`/orders/${orderId}/tracking`);

  return res.data;
};

// =========================
// 🔥 ADMIN EDIT ORDER (NEW)
// =========================
export const adminEditOrder = async (
  orderId: string,
  items: {
    product: string;
    quantity: number;
  }[]
) => {
  const res = await api.patch(
    `/orders/${orderId}`,
    { items },
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return res.data;
};