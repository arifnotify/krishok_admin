import api from "./api";

export const getDashboardSummary =
  async () => {
    const response =
      await api.get(
        "/analytics/summary",
      );

    return response.data;
  };