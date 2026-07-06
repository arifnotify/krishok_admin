import api from "./api";

export const getDashboardSummary = async () => {

  console.log("🌐 Calling /analytics/summary");

  const response = await api.get(
    "/analytics/summary"
  );

  console.log(
    "📡 Axios Response:",
    response
  );

  console.log(
    "📦 Response Data:",
    response.data
  );


  return response.data;
};