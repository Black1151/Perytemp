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
} from "@chakra-ui/react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ConfettiAlt from "@/components/animations/confetti/ConfettiAlt";

interface SignUpSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SignUpSuccessModal = ({
  isOpen,
  onClose,
}: SignUpSuccessModalProps) => {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent p={4}>
          <VStack gap={2}>
            <VStack
              fontSize={80}
              color="green.500"
            >
              <CheckCircleOutlineIcon color="success" fontSize="inherit" />
            </VStack>
            <ModalHeader>Registration Successful</ModalHeader>
            <ModalBody>
              Your account has been created successfully. Please check your
              email for a activation link.
            </ModalBody>
            <ModalFooter>
              <Button variant="primary" onClick={onClose}>
                Go to Login
              </Button>
            </ModalFooter>
          </VStack>
        </ModalContent>
      </Modal>
      <ConfettiAlt show={isOpen} />
    </>
  );
};
