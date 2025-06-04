"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@chakra-ui/react";

interface RecognitionSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * A simple success modal to confirm recognition submission.
 */
export function RecognitionSuccessModal({
  isOpen,
  onClose,
}: RecognitionSuccessModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      returnFocusOnClose={false}
    >
      <ModalOverlay />
      <ModalContent
        bg="primary"
        color="white"
        borderRadius="lg"
        textAlign="center"
        p={5}
      >
        <ModalHeader>Recognition sent!</ModalHeader>
        <ModalBody>Thank you for appreciating your colleagues.</ModalBody>
      </ModalContent>
    </Modal>
  );
}
