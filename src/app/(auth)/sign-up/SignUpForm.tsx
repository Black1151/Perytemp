"use client";

//UNUSED?

import { FieldError, SubmitHandler, useForm } from "react-hook-form";
import { Button, useTheme, VStack } from "@chakra-ui/react";
import { InputField } from "@/components/forms/InputField";

export type SignUpFormInputs = {
  email: string;
  password: string;
  confirmPassword: string;
};

interface SignUpFormProps {
  onSubmit: SubmitHandler<SignUpFormInputs>;
  isSubmitting: boolean;
  errors: {
    email?: FieldError;
    password?: FieldError;
    confirmPassword?: FieldError;
  };
}

export const SignUpForm = ({
  onSubmit,
  isSubmitting,
  errors,
}: SignUpFormProps) => {
  const { register, handleSubmit } = useForm<SignUpFormInputs>();
  const theme = useTheme();

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
      <VStack spacing={4} w="full">
        <InputField
          name="email"
          placeholder="Email"
          type="email"
          error={errors.email}
          register={() => register("email", { required: "Email is required" })}
          focusBorderColor={theme.colors.primary}
        />
        <Button isLoading={isSubmitting} width="full" colorScheme="pink">
          Sign Up
        </Button>
      </VStack>
    </form>
  );
};
