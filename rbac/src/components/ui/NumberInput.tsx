import * as React from "react";
import { cn } from "@/lib/utils";

export interface NumberInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  extendedType?: "number-input" | "decimal-input" | "amount-input";
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ className, type, extendedType, error, ...props }, ref) => {

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      if (extendedType === "amount-input") {
        const value = e.target.value?.replace("", ".");
        const parsedValue = parseFloat(value);
        if (value === "") {
          e.preventDefault();
        } else if (value === ".") {
          e.target.value = "0.00";
          if (props.onChange) {
            props.onChange(e);
          }
        } else {
          const formattedValue = isNaN(parsedValue)
            ? ""
            : parsedValue.toFixed(2);
          e.target.value = formattedValue;
          if (props.onChange) {
            props.onChange(e);
          }
        }
      }
      if (props.onBlur) {
        props.onBlur(e);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (
        extendedType === "amount-input" ||
        extendedType === "decimal-input" ||
        extendedType === "number-input"
      ) {
        const allowedSpecialKeys = [
          "a",
          "x",
          "c",
          "v",
          "z",
          "y",
          "ArrowLeft",
          "ArrowRight",
          "ArrowUp",
          "ArrowDown",
          "Enter",
          "Escape",
          "Tab",
          "Backspace",
          "Delete",
          "Home",
          "End",
          "PageUp",
          "PageDown",
        ];

        if (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) {
          if (allowedSpecialKeys.includes(e.key)) return;
        }

        if (e.key.length === 1) {
          const { value } = e.target as HTMLInputElement;

          if (extendedType === "number-input") {
            if (!/^[0-9]$/.test(e.key)) e.preventDefault();
          } else if (["decimal-input", "amount-input"].includes(extendedType)) {
            const allowedChars = new RegExp(`^[0-9${""}]$`);
            if (
              !allowedChars.test(e.key) ||
              (e.key === "" && value.includes(""))
            ) {
              e.preventDefault();
            }
          }
        }
      }
    };

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-medium ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:font-[400] placeholder:text-[#999999] disabled:cursor-not-allowed disabled:opacity-50",
          className,
          error && "border-[#FF6D6D]"
        )}
        ref={ref}
        {...props}
        value={
          (extendedType === "amount-input" ||
            extendedType === "decimal-input") &&
          props.value
            ? (typeof props.value === "number"
                ? JSON.stringify(props.value)
                : (props.value as string)
              )?.replace(".", delimiter)
            : props.value
        }
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
      />
    );
  }
);

NumberInput.displayName = "NumberInput";

export { NumberInput };
