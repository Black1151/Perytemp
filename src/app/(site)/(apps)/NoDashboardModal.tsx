"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Next.js router for client-side navigation
import SurveyModal from "@/components/surveyjs/layout/default/SurveyModal";

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
      onClose={handleModalConfirm}
      onConfirm={handleModalConfirm}
      showButtons={{
        close: false,
        confirm: true,
      }}
      title="No Dashboards"
      bodyContent="No dashboards are available. Click to return to home."
      confirmLabel="Home"
      cancelLabel="Close"
    />
  );
};

export default NoDashboardsModal;
