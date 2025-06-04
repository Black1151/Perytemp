// components/AddButtonMobile.tsx
import React from "react";
import { Button, Text } from "@chakra-ui/react";
import { Add, PlayCircleFilled } from "@mui/icons-material";

interface AddButtonMobileProps {
  onAddButtonClick: () => void;
  isLoading?: boolean;
  /** A React component for the icon (defaults to MUI’s Add) */
  IconComponent?: React.ComponentType<any>;
  workflow?: boolean;
  label?: string;
}

const AddButtonMobile: React.FC<AddButtonMobileProps> = ({
  onAddButtonClick,
  isLoading = false,
  IconComponent = PlayCircleFilled,
  workflow = true,
  label,
}) => (
  <Button
    variant="workflowStart"
    position="fixed"
    bottom={workflow ? "110px" : ["10px", "45px"]}
    right="12px"
    onClick={onAddButtonClick}
    minH="40px"
    minW="48px"
    h="40px"
    w={"auto"}
    borderRadius="full"
    isLoading={isLoading}
    zIndex={20}
    gap={1}
  >
    <IconComponent />
    <Text fontSize="md">{label}</Text>
  </Button>
);

export default AddButtonMobile;
