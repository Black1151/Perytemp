"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Next.js router for client-side navigation
import SurveyModal from "@/components/surveyjs/layout/default/SurveyModal";
import { Info as InfoIcon } from "@mui/icons-material";

const NoDashboardsModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(true); // Start with the modal open
  const router = useRouter();

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalConfirm = () => {
    setIsModalOpen(false);
    router.push("/"); // Navigate to the home page
  };

  return (
    <SurveyModal
      isOpen={isModalOpen}
      onClose={handleModalClose}
      onConfirm={handleModalConfirm}
      showButtons={{
        close: true,
        confirm: true,
      }}
      title="No Dashboard Available"
      bodyContent="You don't have access to any dashboards at the moment."
      confirmLabel="Close"
      type="info"
      icon={<InfoIcon fontSize="inherit"/>}
    />
  );
};

export default NoDashboardsModal;
