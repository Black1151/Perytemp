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
import { duplicateCustomerEmailSchedule } from "@/components/surveyjs/forms/duplicateCustomerEmailSchedule";
import AdminFormWrapper from "@/components/surveyjs/AdminFormWrapper";

interface AssignScheduleProps {
  isOpen: boolean; // Controlled by the parent
  onClose: () => void; // Close handler passed by parent
  endpoint: string;
  id: string;
}

const AssignSchedule = ({ isOpen, onClose, id }: AssignScheduleProps) => {
  // Function to handle the form completion event
  const handleSurveySuccess = () => {
    onClose(); // Close the modal after survey success
  };

  // Function to handle the form completion event
  const handleSurveyFailure = () => {
    onClose(); // Close the modal after survey failure
  };

  const data = {
    scheduleId: id,
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader paddingBottom={0}>
          <Flex justifyContent={"center"} alignItems={"center"} width={"100%"}>
            Assign Schedule To Customer
          </Flex>
        </ModalHeader>
        <ModalBody>
          <AdminFormWrapper
            formJson={duplicateCustomerEmailSchedule}
            data={data}
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
            endpoint={"/createCustomerEmailSchedule"}
            formSuccessMessage={null}
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

export default AssignSchedule;
