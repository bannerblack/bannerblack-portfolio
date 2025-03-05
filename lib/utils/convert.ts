export const convertDate = (date: string) => {
  // Input: 2025-03-02T18:07:29.145328+00:00
  // Output: 2025-03-02
  const dateObj = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };
  return dateObj.toLocaleDateString("en-US", options);
};
