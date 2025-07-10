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
import SurveyModal from "@/components/surveyjs/layout/default/SurveyModal";

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
      <SurveyModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={onClose}
        type="success"
        showButtons={{ close: false, confirm: true }}
        title="Registration Successful"
        bodyContent="Your account has been created successfully. Please check your email for an activation link."
        confirmLabel="Go to Login"
      />
      <ConfettiAlt show={isOpen} />
    </>
  );
};
