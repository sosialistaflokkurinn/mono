import React from "react";
import {
  TextArea as AriaTextArea,
  TextField as AriaTextField,
  type TextFieldProps as AriaTextFieldProps,
  type ValidationResult,
} from "react-aria-components";
import { tv } from "tailwind-variants";

import { Description, fieldBorderStyles, FieldError, Label } from "./field";
import { composeTailwindRenderProps, focusRing } from "./utils";

const textareaStyles = tv({
  extend: focusRing,
  base: "border-2 rounded-md px-2 py-1.5 min-h-[80px] flex-1 min-w-0 outline outline-0 bg-white dark:bg-zinc-900 text-sm text-gray-800 dark:text-zinc-200 disabled:text-gray-200 dark:disabled:text-zinc-600 resize-vertical",
  variants: {
    isFocused: fieldBorderStyles.variants.isFocusWithin,
    isInvalid: fieldBorderStyles.variants.isInvalid,
    isDisabled: fieldBorderStyles.variants.isDisabled,
  },
});

export interface TextAreaFieldProps extends AriaTextFieldProps {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  placeholder?: string;
  rows?: number;
}

export function TextAreaField({
  label,
  description,
  errorMessage,
  placeholder,
  rows,
  ...props
}: TextAreaFieldProps) {
  return (
    <AriaTextField
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "flex flex-col gap-1",
      )}
    >
      {label && <Label>{label}</Label>}
      <AriaTextArea
        className={textareaStyles}
        placeholder={placeholder}
        rows={rows}
      />
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
    </AriaTextField>
  );
}

// Backward compatibility export
export const Textarea = TextAreaField;
