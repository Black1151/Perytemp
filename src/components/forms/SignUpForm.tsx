"use client";

import { FieldError, SubmitHandler, useForm } from "react-hook-form";
import { Button, Flex, Text, useTheme, VStack, HStack } from "@chakra-ui/react";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EmailIcon from "@mui/icons-material/Email";
import { InputField } from "./InputField";
import { emailValidation } from "./validationSchema/validationSchema";
import { useRouter, useSearchParams } from "next/navigation";

export type SignUpFormInputs = {
  email: string;
};

interface SignUpFormProps {
  onSubmit: SubmitHandler<SignUpFormInputs>;
  isSubmitting: boolean;
  errors: {
    email?: FieldError;
  };
}

export function SignUpForm({ onSubmit, isSubmitting }: SignUpFormProps) {
  const theme = useTheme();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<SignUpFormInputs>();

  const handleFormSubmit: SubmitHandler<SignUpFormInputs> = (data) => {
    onSubmit(data);
  };

  const handleSwitch = () => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("signUpType", "company");
    router.push(`/sign-up?${searchParams.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      style={{ width: "100%", maxWidth: "sm" }}
    >
      <VStack spacing={0} w="100%">
        <VStack spacing={0} w={"100%"} gap={2}>
          <InputField
            name="email"
            placeholder="Email"
            type="text"
            error={formErrors.email}
            icon={
              <EmailIcon
                style={{
                  width: "20px",
                  color: formErrors.email ? "red" : "lightGray",
                }}
              />
            }
            register={() => register("email", emailValidation)}
            focusBorderColor={theme.colors.primary}
          />
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Sign Up
          </Button>
        </VStack>
      </VStack>
    </form>
  );
}
