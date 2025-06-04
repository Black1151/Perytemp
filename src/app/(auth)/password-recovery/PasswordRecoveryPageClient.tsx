"use client";

import { useDisclosure } from "@chakra-ui/react";
import { PasswordRecoveryForm } from "@/components/forms/PasswordRecoveryForm";
import { PasswordRecoveryModal } from "./PasswordRecoveryModal";
import { SignUpFormInputs } from "@/components/forms/SignUpForm";
import { useFetchClient } from "@/hooks/useFetchClient";

export const PasswordRecoveryPageClient = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { fetchClient, loading } = useFetchClient();

  const handleFormSubmit = async (data: SignUpFormInputs) => {
    const result = await fetchClient("/api/auth/password-recovery", {
      method: "POST",
      body: data,
      redirectOnError: false,
    });
    if (result) {
      onOpen();
    }
  };

  return (
    <>
      <PasswordRecoveryForm
        onSubmit={handleFormSubmit}
        isSubmitting={loading}
      />
      <PasswordRecoveryModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};
