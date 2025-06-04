"use client";

import React, { useState } from "react";
import { UserModal } from "@/components/modals/userModal/UserModal";
import { WorkflowModal } from "@/components/modals/workflowModal/WorkflowModal";
import { UserAccessControlContextProps, UserContextProps, useUser } from "@/providers/UserProvider";
import { Flex, IconButton } from "@chakra-ui/react";
import {
  Cancel,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";

interface DeveloperBoardOptionsProps {
  userMetadata: UserContextProps;
  userAccessControl: UserAccessControlContextProps
}

const DeveloperBoardOptions: React.FC<DeveloperBoardOptionsProps> = ({
  userMetadata,
  userAccessControl,
}) => {
  const { showDeveloperBoard, updateShowDeveloperBoard } = useUser();
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => setIsExpanded((prev) => !prev);

  const isDevelopment = process.env.NODE_ENV === "development";
  const shouldRender = isDevelopment || (!isDevelopment && showDeveloperBoard);

  if (!shouldRender) return null;

  const cancelButtonClick = () => {
    updateShowDeveloperBoard(false);
  };

  return (
    <Flex
      position="fixed"
      right="20px"
      bottom="20px"
      zIndex={1000}
      flexDirection="column-reverse"
      alignItems="center"
      gap={4}
    >
      {/* Main Button */}
      <IconButton
        aria-label="Expand Developer Options"
        icon={!isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        onClick={toggleExpand}
        background="teal.500"
        color="white"
        _hover={{ background: "teal.600" }}
        size="lg"
        isRound
        zIndex={1001}
      />

      {/* Developer Options */}
      {isExpanded && (
        <Flex
          flexDirection="column"
          gap={4}
          transition="all 0.3s ease-in-out"
          transform={isExpanded ? "translateY(0)" : "translateY(20px)"}
        >
          {/* Cancel Button */}
          <IconButton
            aria-label="Cancel"
            icon={<Cancel />}
            onClick={cancelButtonClick}
            background="red.500"
            color="white"
            isDisabled={process.env.NODE_ENV === "development"}
            _hover={{ background: "red.600" }}
            size="lg"
            borderRadius="full"
          />

          <UserModal userMetadata={userMetadata} userAccessControl={userAccessControl}/>

          <WorkflowModal />
        </Flex>
      )}
    </Flex>
  );
};

export default DeveloperBoardOptions;
