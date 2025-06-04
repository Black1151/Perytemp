"use client";

import { FieldError, SubmitHandler, useForm } from "react-hook-form";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useTheme,
  VStack,
} from "@chakra-ui/react";
import LockIcon from "@mui/icons-material/Lock";
import { InputField } from "./InputField";
import { useRouter } from "next/navigation";
import { passwordValidation } from "./validationSchema/validationSchema";
import { useFetchClient } from "@/hooks/useFetchClient";
import { Email } from "@mui/icons-material";

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

export function PasswordResetForm({ token }: ActivateAccountFormProps) {
  const theme = useTheme();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
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
    const result = await fetchClient("/api/auth/password-reset", {
      method: "POST",
      body: {
        token,
        password: data.password,
      },
      errorMessage: "Invalid token - please request a new password reset",
      redirectOnError: false,
    });

    if (result) {
      onOpen();
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        style={{ width: "100%", maxWidth: "sm" }}
      >
        <VStack spacing={0} w="100%">
          <VStack spacing={0} w={300}>
            <InputField
              name="password"
              placeholder="Password"
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
              placeholder="Repeat Password"
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
              mt={0}
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
              Update Password
            </Button>
          </VStack>
        </VStack>
      </form>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent p={5}>
          <VStack gap={2}>
            <Email fontSize="large"/>
            <ModalHeader>Password updated successfully</ModalHeader>
            <ModalBody>
              Your password has been successfully updated. You can now log in
              with your new password.
            </ModalBody>
            <ModalFooter>
              <Button variant="primary" onClick={() => router.push("/login")}>
                To Login
              </Button>
            </ModalFooter>
          </VStack>
        </ModalContent>
      </Modal>
    </>
  );
}
