"use client";

import { SpringModal } from "@/components/modals/springModal/SpringModal";
import { CheckCircle } from "@mui/icons-material";

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
    <SpringModal
      isOpen={isOpen}
      onClose={onClose}
      showClose={false}
      bg="primary"
      color="white"
      frontIcon={<CheckCircle />}
      bgIcon={<CheckCircle />}
      header="Recognition sent!"
      body="Thank you for appreciating your colleagues."
      primaryLabel="Close"
      onPrimaryClick={onClose}
      primaryIcon={<CheckCircle />}
    />
  );
}
