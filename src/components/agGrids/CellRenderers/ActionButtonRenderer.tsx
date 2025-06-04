"use client";

import React, { useState } from "react";
import { Box, IconButton, Switch, useDisclosure } from "@chakra-ui/react";
import { ContentCopy, Visibility } from "@mui/icons-material"; // MUI icons
import { useRouter } from "next/navigation";
import { useFetchClient } from "@/hooks/useFetchClient";
import Link from "next/link";
import { useUser } from "@/providers/UserProvider";

interface ActionButtonRendererProps {
  node: { data: { [key: string]: any; isActive: boolean } }; // Support dynamic keys for node data
  redirectUrl?: string;
  updateUrl?: string;
  DuplicateComponent?: React.ElementType;
  idField: string;
  rolesCanEdit?: string[];
}

const ActionButtonRenderer: React.FC<ActionButtonRendererProps> = ({
  node,
  redirectUrl,
  updateUrl,
  DuplicateComponent,
  idField,
  rolesCanEdit = ["CU", "CL", "CS", "CA", "PA", "EU"],
}) => {
  const router = useRouter();
  const { user } = useUser();
  const [isActive, setIsActive] = useState(node?.data?.isActive);
  const { fetchClient } = useFetchClient();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Handle the click for creating new items
  const handleDuplicateClick = () => {
    if (DuplicateComponent) {
      onOpen();
    }
  };

  // Access uniqueId dynamically using idField
  const uniqueId = node?.data?.[idField];

  const link = uniqueId ? `${redirectUrl}/${uniqueId}` : redirectUrl;

  // Only allow role-based actions if user.role is defined and in the allowed roles
  const canEdit = user?.role && rolesCanEdit.includes(user.role);

  // Handle Toggle Active/Inactive Status
  const handleToggle = async () => {
    if (uniqueId) {
      const newIsActive = !isActive;
      setIsActive(newIsActive); // Optimistically update UI

      // Send both uniqueId and data in the body as properly serialized JSON
      const result = await fetchClient(`${updateUrl}`, {
        method: "PUT",
        body: {
          uniqueId, // Include uniqueId in the body
          data: { isActive: newIsActive }, // Add the new isActive state as part of data
        },
        successMessage: "Updated record successfully.",
        errorMessage: "Unable to update record. Please try again.",
        redirectOnError: false,
      });

      if (!result) {
        setIsActive(!newIsActive); // Roll back UI update if the request fails
      }
    } else {
      console.error("Node or ID is not defined.");
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="flex-end"
      alignItems="center"
      gap={2}
      height="100%"
    >
      {updateUrl && canEdit && (
        <Switch
          isChecked={isActive}
          onChange={handleToggle}
          variant={"primary"}
          sx={{
            alignSelf: "center",
          }}
        />
      )}
      {DuplicateComponent && (
        <Box height={"full"}>
          <IconButton
            aria-label="View"
            aspectRatio={1}
            variant="agPrimary"
            onClick={handleDuplicateClick}
            icon={<ContentCopy style={{ fontSize: "inherit" }} />}
            sx={{
              height: "80%",
              alignSelf: "center",
            }}
          />
        </Box>
      )}
      {link && (
        <Box height={"full"}>
          <Link href={link}>
            <IconButton
              aria-label="View"
              aspectRatio={1}
              variant="agPrimary"
              icon={<Visibility style={{ fontSize: "inherit" }} />}
              sx={{
                height: "80%",
                alignSelf: "center",
              }}
            />
          </Link>
        </Box>
      )}

      {/* Render the modal component with modal state control */}
      {DuplicateComponent && (
        <DuplicateComponent isOpen={isOpen} onClose={onClose} id={uniqueId} />
      )}
    </Box>
  );
};

export default ActionButtonRenderer;
