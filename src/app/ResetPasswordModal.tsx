"use client";

import React from "react";
import SurveyModal from "@/components/surveyjs/layout/default/SurveyModal";
import { useUser } from "@/providers/UserProvider";
import { useFetchClient } from "@/hooks/useFetchClient";
import { LockReset, Password } from "@mui/icons-material";

const ResetPasswordModal = ({
  openState,
  handleOnClose,
}: {
  openState: boolean;
  handleOnClose: () => void;
}) => {
  const { user } = useUser();
  const { fetchClient } = useFetchClient();

  const handlePasswordReset = async () => {
    const data = {
      email: user?.email,
    };

    const result = await fetchClient("/api/auth/password-recovery", {
      method: "POST",
      body: data,
      redirectOnError: false,
      successMessage: "A password reset email has been sent to you.",
      errorMessage: "Looks like something went wrong, please try again.",
    });

    if (result) {
      handleOnClose();
    }
  };

  return (
    <>
      <SurveyModal
        isOpen={openState}
        onClose={handleOnClose}
        onConfirm={handlePasswordReset}
        title={"Reset Password"}
        bodyContent={`Are you sure you want to reset your password? Click send email to confirm.`}
        confirmLabel={"Send Email"}
        cancelLabel={"Cancel"}
        icon={<LockReset fontSize="large" />}
      />
    </>
  );
};

export default ResetPasswordModal;
