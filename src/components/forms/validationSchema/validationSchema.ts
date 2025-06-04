import { ValidationRule } from "react-hook-form";

export const emailValidation = {
  required: "Email is required",
  pattern: {
    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    message: "Please enter a valid email address",
  } as ValidationRule<RegExp>,
};

export const passwordValidation = {
  required: "Password is required",
  validate: {
    hasUpperCase: (value: string) =>
      /[A-Z]/.test(value) ||
      "Password must contain at least one uppercase letter",
    hasLowerCase: (value: string) =>
      /[a-z]/.test(value) ||
      "Password must contain at least one lowercase letter",
    hasNumber: (value: string) =>
      /[0-9]/.test(value) || "Password must contain at least one number",
    hasSpecialChar: (value: string) =>
      /[!@#$%^&*(),.?":{}|<>;\[\]/\\~`+=_-]/.test(value) ||
      "Password must contain at least one special character",
    hasMinLength: (value: string) =>
      value.length >= 8 || "Password must be at least 8 characters long",
  },
};

export const phoneNumberValidation = {
  required: "Phone number is required",
  pattern: {
    value: /^0\d{2,3}(\s?\d{2,4}){2,3}$/,
    message: "Please enter a valid UK phone number.",
  } as ValidationRule<RegExp>,
};
