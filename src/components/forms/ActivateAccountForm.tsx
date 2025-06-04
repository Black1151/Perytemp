"use client";

import { FieldError, SubmitHandler, useForm } from "react-hook-form";
import { Button, useTheme, VStack } from "@chakra-ui/react";
import LockIcon from "@mui/icons-material/Lock";
import { InputField } from "./InputField";
import { useRouter } from "next/navigation";
import { passwordValidation } from "./validationSchema/validationSchema";
import { useFetchClient } from "@/hooks/useFetchClient";

export type ActivateAccountFormInputs = {
  password: string;
  repeatPassword: string;
};

interface ActivateAccountFormProps {
  token: string;
  errors: {
    password?: FieldError;
    repeatPassword?: FieldError;
  };
}

export function ActivateAccountForm({ token }: ActivateAccountFormProps) {
  const theme = useTheme();
  const router = useRouter();
  const { fetchClient, loading } = useFetchClient();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors: formErrors },
  } = useForm<ActivateAccountFormInputs>();

  const handleFormSubmit: SubmitHandler<ActivateAccountFormInputs> = async (
    data
  ) => {
    const result = await fetchClient("/api/auth/activate-account", {
      method: "PUT",
      body: {
        token,
        password: data.password,
      },
      successMessage:
        "Account Activated. Your account has been successfully activated.",
      errorMessage: "There was an error activating your account!",
      redirectOnError: false,
    });

    if (result) {
      router.push("/login");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      style={{ width: "100%", maxWidth: "md" }}
    >
      <VStack spacing={4} w="100%">
        <VStack spacing={0} w={300}>
          <InputField
            name="password"
            placeholder="Enter password"
            type="password"
            error={formErrors.password}
            icon={
              <LockIcon
                style={{
                  width: "20px",
                  color: formErrors.password ? "red" : "lightGray",
                }}
              />
            }
            register={() => register("password", passwordValidation)}
            focusBorderColor={theme.colors.primary}
          />
          <InputField
            name="repeatPassword"
            placeholder="Confirm password"
            type="password"
            error={formErrors.repeatPassword}
            icon={
              <LockIcon
                style={{
                  width: "20px",
                  color: formErrors.repeatPassword ? "red" : "lightGray",
                }}
              />
            }
            register={() =>
              register("repeatPassword", {
                required: "Please repeat your password",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })
            }
            focusBorderColor={theme.colors.primary}
          />
          <Button
            mt="60px"
            backgroundColor={theme.colors.primary}
            type="submit"
            w="full"
            isLoading={loading}
            height={12}
            color="white"
            _hover={{
              color: theme.colors.primary,
              border: `1px solid ${theme.colors.primary}`,
              backgroundColor: "white",
            }}
          >
            Activate Account
          </Button>
        </VStack>
      </VStack>
    </form>
  );
}
