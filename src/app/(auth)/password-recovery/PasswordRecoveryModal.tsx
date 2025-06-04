"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
  Text,
  HStack,
  Stack,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { Email } from "@mui/icons-material";

interface PasswordRecoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PasswordRecoveryModal = ({
  isOpen,
  onClose,
}: PasswordRecoveryModalProps) => {
  const router = useRouter();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent alignContent={"center"}>
        <ModalBody
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          p={8}
        >
          <Email fontSize="large" style={{ marginBottom: 12 }} />
          <Text fontSize="xl" fontWeight="semibold" mb={2}>
            Password reset request sent
          </Text>
          <Text mb={4}>
            If the email address given is registered with us you will get an
            email containing a link in the next few minutes.
          </Text>
          <HStack spacing={2} width="100%" justifyContent="center">
            <Button onClick={() => router.push("/login")}>
              Login
            </Button>
          </HStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
