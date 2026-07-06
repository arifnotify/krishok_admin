import api from "./api";

export const getDashboardSummary = async () => {
  console.log("🔥 Calling API...");

  try {
    const response = await api.get(
      "/analytics/summary"
    );

    console.log(
      "✅ Axios Response:",
      response
    );

    console.log(
      "✅ Response Data:",
      response.data
    );

    return response.data;

  } catch (error: any) {

    console.log(
      "❌ API ERROR:",
      error
    );

    console.log(
      "❌ ERROR RESPONSE:",
      error?.response
    );

    throw error;
  }
};