"use client";

import React from "react";
import { Flex } from "@chakra-ui/react";
import { assignGroupJson } from "@/components/surveyjs/forms/assignGroup";
import AdminFormWrapper from "@/components/surveyjs/AdminFormWrapper";
import { SpringModal } from "@/components/modals/springModal/SpringModal";
import { Group } from "@mui/icons-material";
import { useTheme } from "@chakra-ui/react";

interface AssignGroupModalProps {
  isOpen: boolean; // Controls modal visibility
  onClose: () => void; // Handler to close the modal
}

const AssignGroupModal = ({ isOpen, onClose }: AssignGroupModalProps) => {
  const theme = useTheme();

  // Function to handle the form completion event
  const handleSurveySuccess = () => {
    onClose(); // Close the modal after survey success
  };

  const handleSurveyFailure = () => {
    onClose(); // Close the modal after survey failure
  };

  return (
    <SpringModal
      isOpen={isOpen}
      onClose={onClose}
      showClose={true}
      bg={theme.colors.primary}
      color="white"
      frontIcon={<Group />}
      bgIcon={<Group />}
      header="Assign User Groups"
      body={
        <AdminFormWrapper
          formJson={assignGroupJson}
          data={null}
          layoutConfig={{
            layoutKey: "default",
            layoutProps: {
              showTopNavigation: false,
              showBottomNavigation: true,
            },
          }}
          globalVariables={[]}
          stylingConfig={{
            sjsFilePath: "admin",
            cssFilePath: "admin",
          }}
          jsImport={""}
          excludeKeys={[]}
          endpoint={"/assignUserGroups"}
          formSuccessMessage={"Groups assigned successfully"}
          reloadPageOnSuccess={true}
          redirectUrl={null}
          isNew={true}
          isAllowedToEdit={true}
          onSurveySuccess={handleSurveySuccess}
          onSurveyFailure={handleSurveyFailure}
        />
      }
    />
  );
};

export default AssignGroupModal;
