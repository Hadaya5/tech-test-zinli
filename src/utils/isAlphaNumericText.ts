const alphaNumericRegex = /^[\p{L}\p{N}\s]*$/u;

export const isAlphaNumericText = (value: string) =>
  alphaNumericRegex.test(value);