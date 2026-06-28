export const formatDate = (dateString) => {
  if (!dateString || dateString === "N/A") return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const getDaysUntilRenewal = (nextBillingDate) => {
  if (!nextBillingDate || nextBillingDate === "N/A") return null;

  const today = new Date();
  const renewal = new Date(nextBillingDate);

  today.setHours(0, 0, 0, 0);
  renewal.setHours(0, 0, 0, 0);

  const differenceInTime = renewal.getTime() - today.getTime();
  const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

  return differenceInDays;
};
