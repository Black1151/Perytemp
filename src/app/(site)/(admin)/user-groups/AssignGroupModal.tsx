"use client";

import {
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

import React from "react";
import { assignGroupJson } from "@/components/surveyjs/forms/assignGroup";
import AdminFormWrapper from "@/components/surveyjs/AdminFormWrapper";

interface AssignGroupModalProps {
  isOpen: boolean; // Controls modal visibility
  onClose: () => void; // Handler to close the modal
}

const AssignGroupModal = ({ isOpen, onClose }: AssignGroupModalProps) => {
  // Function to handle the form completion event
  const handleSurveySuccess = () => {
    onClose(); // Close the modal after survey success
  };

  const handleSurveyFailure = () => {
    onClose(); // Close the modal after survey failure
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader paddingBottom={0}>
          <Flex justifyContent={"center"} alignItems={"center"} width={"100%"}>
            Assign User Groups
          </Flex>
        </ModalHeader>
        <ModalBody>
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
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AssignGroupModal;
