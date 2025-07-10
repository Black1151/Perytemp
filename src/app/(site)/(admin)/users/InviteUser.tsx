"use client";

import React from "react";
import { Flex } from "@chakra-ui/react";
import { inviteUserJson } from "@/components/surveyjs/forms/inviteUser";
import AdminFormWrapper from "@/components/surveyjs/AdminFormWrapper";
import { SpringModal } from "@/components/modals/springModal/SpringModal";
import { PersonAdd } from "@mui/icons-material";
import { useTheme } from "@chakra-ui/react";

interface InviteNewUserModalForPAProps {
  isOpen: boolean; // Controlled by the parent
  onClose: () => void; // Close handler passed by parent
}

const InviteNewUserModalForPA = ({
  isOpen,
  onClose,
}: InviteNewUserModalForPAProps) => {
  const theme = useTheme();

  // Function to handle the form completion event
  const handleSurveySuccess = () => {
    onClose(); // Close the modal after survey success
  };

  // Function to handle the form completion event
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
      frontIcon={<PersonAdd />}
      bgIcon={<PersonAdd />}
      header="Invite New User"
      body={
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
      }
    />
  );
};

export default InviteNewUserModalForPA;
