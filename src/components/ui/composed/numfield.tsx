import React from "react";
import { Input, InputProps } from "../input";

type NumFieldProps = {
  allowEmpty?: boolean;
  minValue?: number;
  maxValue?: number;
};

const NumField = React.forwardRef<
  HTMLInputElement,
  Omit<InputProps, "type"> & NumFieldProps
>(({ allowEmpty, minValue, maxValue, onChange, onBlur, ...props }, ref) => {
  return (
    <Input
      {...props}
      ref={ref}
      type="number"
      onChange={(e) => {
        if (maxValue && Number(e.target.value) > maxValue)
          e.target.value = maxValue.toString();
        if (minValue && Number(e.target.value) < minValue)
          e.target.value = minValue.toString();
        if (onChange) onChange(e);
      }}
      onBlur={(e) => {
        if (e.target.value === "" && !allowEmpty)
          e.target.value = minValue?.toString() ?? "0";
        if (onBlur) onBlur(e);
      }}
      onKeyDown={(e) =>
        ["E", "e", "+", "-"].includes(e.key) && e.preventDefault()
      }
      onWheel={(e) => e.currentTarget.blur()}
    />
  );
});

export default NumField;
