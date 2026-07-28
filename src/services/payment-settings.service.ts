import api from "./api";

export interface PaymentSettings {
  codEnabled: boolean;
  sslcommerzEnabled: boolean;
}

// GET SETTINGS
export const getPaymentSettings =
  async () => {
    const res = await api.get(
      "/payment-settings"
    );

    return res.data;
  };

// UPDATE SETTINGS
export const updatePaymentSettings =
  async (
    data: PaymentSettings
  ) => {
    const res = await api.patch(
      "/payment-settings",
      data
    );

    return res.data;
  };