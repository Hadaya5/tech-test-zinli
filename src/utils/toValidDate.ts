export const toValidDate = (value: unknown) => {
  const parsedDate =
    typeof value === "string" || value instanceof Date
      ? new Date(value)
      : new Date();

  return Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
};