"use client";

import {
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Text,
  useTheme,
  VStack,
} from "@chakra-ui/react";
import { css } from "@emotion/react";
import { FocusEvent, ReactElement, useState } from "react";
import { FieldError } from "react-hook-form";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface InputFieldProps {
  name: string;
  placeholder: string;
  type?: string;
  error?: FieldError | undefined;
  icon?: ReactElement;
  register: any;
  focusBorderColor: string;
  options?: { value: string | number; label: string }[];
  onChange?: (value: string | number) => void;
  disabled?: boolean;
}

export type DropdownOption = {
  value: string | number;
  label: string;
};

export function InputField({
  name,
  placeholder,
  type = "text",
  error,
  icon,
  register,
  focusBorderColor = "#ff0070",
  options,
  onChange,
  disabled = false,
}: InputFieldProps) {
  const [selectedValue, setSelectedValue] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const theme = useTheme();

  const handleFocus = (e: FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const iconElement = e.target.previousElementSibling?.querySelector(
      "svg"
    ) as HTMLElement | null;
    if (iconElement) {
      iconElement.style.color = error ? "red" : focusBorderColor;
    }
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const iconElement = e.target.previousElementSibling?.querySelector(
      "svg"
    ) as HTMLElement | null;
    if (iconElement) {
      iconElement.style.color = error ? "red" : "lightGray";
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedValue(value);
    register(name).onChange(e);
    if (typeof onChange === "function") {
      onChange(value);
    }
  };

  const commonStyles = {
    width: "100%",
    fontSize: "16px",
    paddingTop: "0.5rem",
    paddingBottom: "0.5rem",
    borderColor: error ? "red" : "gray.400",
    borderBottomWidth: "1px",
    borderLeft: "none",
    borderTop: "none",
    borderRight: "none",
    borderRadius: "none",
    color: "black",
    _placeholder: { fontSize: "sm", color: "gray.400" },
    _focus: {
      boxShadow: "none",
      borderBottomColor: error ? "red.500" : focusBorderColor,
      color: error ? "red.500" : focusBorderColor,
    },
    css: css`
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px ${theme.colors.pink[200]} inset;
        box-shadow: 0 0 0px 1000px ${theme.colors.pink[200]} inset;
      }
      &:-webkit-autofill:focus {
        -webkit-box-shadow: 0 0 0px 1000px ${theme.colors.pink[300]} inset;
        box-shadow: 0 0 0px 1000px ${theme.colors.pink[300]} inset;
      }
    `,
  };

  return (
    <VStack width="100%">
      <InputGroup alignItems="center" width="100%" px={0}>
        {icon && (
          <InputLeftElement pr={1} pointerEvents="none">
            {icon}
          </InputLeftElement>
        )}

        {type === "date" ? (
          <ReactDatePicker
            selected={startDate}
            onChange={(date: Date | null) => setStartDate(date)}
            disabled={disabled}
            customInput={
              <Input
                {...register(name)}
                placeholder={placeholder}
                onFocus={handleFocus}
                onBlur={handleBlur}
                {...commonStyles}
                width={"300px"}
                disabled={disabled}
              />
            }
            placeholderText={placeholder}
            dateFormat="yyyy-MM-dd"
          />
        ) : options ? (
          <Select
            {...register(name)}
            onChange={handleSelectChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            value={selectedValue}
            pl={0}
            sx={{
              color: selectedValue === "" ? "gray.400" : "black",
              option: {
                backgroundColor: theme.colors.elementBG,
              },
            }}
            {...commonStyles}
            disabled={disabled}
          >
            <option value="" disabled hidden>
              {placeholder}
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        ) : (
          <Input
            {...register(name)}
            type={type}
            placeholder={placeholder}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...commonStyles}
            disabled={disabled}
          />
        )}
      </InputGroup>

      <HStack w="100%" h={5}>
        {error && (
          <Text fontWeight="bold" fontSize="2xs" color="red">
            {error.message}
          </Text>
        )}
      </HStack>
    </VStack>
  );
}
