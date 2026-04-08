import { useState } from "react";
import type { KeyboardEventHandler } from "react";
import { isAlphaNumericText } from "../utils";

interface InputProps {
  value: string;
  className: string;
  placeholder?: string;
  ariaLabel: string;
  autoFocus?: boolean;
  onChange: (value: string) => void;
  onBlur?: () => void;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
}

export function Input({
  value,
  className,
  placeholder,
  ariaLabel,
  autoFocus,
  onChange,
  onBlur,
  onKeyDown,
}: InputProps) {
  const [errorText, setErrorText] = useState("");

  const handleChange = (nextValue: string) => {
    if (isAlphaNumericText(nextValue)) {
      setErrorText("");
      onChange(nextValue);
      return;
    }

    setErrorText("Only alphanumeric characters are allowed.");
  };

  return (
    <div className={styles.wrapper}>
      <input
        autoFocus={autoFocus}
        className={className}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        aria-label={ariaLabel}
      />
      {errorText ? <p className={styles.errorText}>{errorText}</p> : null}
    </div>
  );
}

const styles = {
  wrapper: "grid gap-1 w-full",
  errorText: "text-sm text-red-600",
};
