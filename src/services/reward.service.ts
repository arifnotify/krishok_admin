import api from "./api";

// =========================
// REWARD SETTINGS
// =========================

export const getRewardSettings =
  async () => {
    const res =
      await api.get(
        "/reward-settings",
      );

    return res.data;
  };

export const createRewardSettings =
  async (data: {
    regularPercentage: number;
    premiumPercentage: number;
    vipPercentage: number;
    perAmount: number;
    minimumRedeem: number;
    maximumRedeem: number;
    expireDays: number;
    isActive: boolean;
  }) => {
    const res =
      await api.post(
        "/reward-settings",
        data,
      );

    return res.data;
  };

export const updateRewardSettings =
  async (data: {
    regularPercentage: number;
    premiumPercentage: number;
    vipPercentage: number;
    perAmount: number;
    minimumRedeem: number;
    maximumRedeem: number;
    expireDays: number;
    isActive: boolean;
  }) => {
    const res =
      await api.patch(
        "/reward-settings",
        data,
      );

    return res.data;
  };

// =========================
// REWARD WALLETS
// =========================

export const getRewardWallets =
  async () => {
    const res =
      await api.get(
        "/rewards/admin/wallets",
      );

    return res.data;
  };

// =========================
// REWARD TRANSACTIONS
// =========================

export const getRewardTransactions =
  async () => {
    const res =
      await api.get(
        "/rewards/admin/transactions",
      );

    return res.data;
  };