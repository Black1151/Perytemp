"use client";

import {
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

import { inviteUserJson } from "@/components/surveyjs/forms/inviteUser";
import React from "react";
import AdminFormWrapper from "@/components/surveyjs/AdminFormWrapper";

interface InviteNewUserModalForPAProps {
  isOpen: boolean; // Controlled by the parent
  onClose: () => void; // Close handler passed by parent
}

const InviteNewUserModalForPA = ({
  isOpen,
  onClose,
}: InviteNewUserModalForPAProps) => {
  // Function to handle the form completion event
  const handleSurveySuccess = () => {
    onClose(); // Close the modal after survey success
  };

  // Function to handle the form completion event
  const handleSurveyFailure = () => {
    onClose(); // Close the modal after survey failure
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader paddingBottom={0}>
          <Flex justifyContent={"center"} alignItems={"center"} width={"100%"}>
            Invite New User
          </Flex>
        </ModalHeader>
        <ModalBody>
          <AdminFormWrapper
            formJson={inviteUserJson}
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
            excludeKeys={["imageUrl"]}
            endpoint={"/registerByInvite"}
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

export default InviteNewUserModalForPA;
