import { isAlphaNumericText } from "./isAlphaNumericText";

export const normalizeText = (value: unknown, fallback: string) => {
  if (typeof value !== "string") {
    return fallback;
  }

  const normalizedValue = value.trim();

  if (!normalizedValue || !isAlphaNumericText(normalizedValue)) {
    return fallback;
  }

  return normalizedValue;
};