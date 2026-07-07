export const formatDate = (
  date: string
) => {
  return new Date(date).toLocaleString(
    "en-BD",
    {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
};