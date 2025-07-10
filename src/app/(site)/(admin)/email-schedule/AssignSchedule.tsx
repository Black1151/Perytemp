"use client";

import React from "react";
import { Flex } from "@chakra-ui/react";
import { duplicateCustomerEmailSchedule } from "@/components/surveyjs/forms/duplicateCustomerEmailSchedule";
import AdminFormWrapper from "@/components/surveyjs/AdminFormWrapper";
import { SpringModal } from "@/components/modals/springModal/SpringModal";
import { Schedule } from "@mui/icons-material";
import { useTheme } from "@chakra-ui/react";

interface AssignScheduleProps {
  isOpen: boolean; // Controlled by the parent
  onClose: () => void; // Close handler passed by parent
  endpoint: string;
  id: string;
}

const AssignSchedule = ({ isOpen, onClose, id }: AssignScheduleProps) => {
  const theme = useTheme();

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
    <SpringModal
      isOpen={isOpen}
      onClose={onClose}
      showClose={true}
      bg={theme.colors.primary}
      color="white"
      frontIcon={<Schedule />}
      bgIcon={<Schedule />}
      header="Assign Schedule To Customer"
      body={
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
      }
    />
  );
};

export default AssignSchedule;
