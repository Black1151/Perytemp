"use client";

import {
  Button,
  VStack,
  Text,
  HStack,
  useTheme,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { Check, CheckCircle, CheckCircleOutline, Email } from "@mui/icons-material";
import { SpringModal } from "@/components/modals/springModal/SpringModal";

interface PasswordRecoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PasswordRecoveryModal = ({
  isOpen,
  onClose,
}: PasswordRecoveryModalProps) => {
  const router = useRouter();
  const theme = useTheme();

  return (
    <SpringModal
      isOpen={isOpen}
      onClose={onClose}
      showClose={false}
      frontIcon={<Email />}
      bgIcon={<CheckCircleOutline fontSize="inherit"/>}
      header="Password reset request sent"
      body={
        <Text mb={4}>
          If the email address given is registered with us you will get an
          email containing a link in the next few minutes.
        </Text>
      }
      primaryLabel="Login"
      onPrimaryClick={() => router.push("/login")}
      bg={"green.500"}
      color="white"
    />
  );
};
