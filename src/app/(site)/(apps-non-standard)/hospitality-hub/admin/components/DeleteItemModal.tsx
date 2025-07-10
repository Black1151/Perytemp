"use client";

import {
  // Modal,
  // ModalOverlay,
  // ModalContent,
  // ModalHeader,
  // ModalBody,
  // ModalFooter,
  // ModalCloseButton,
  Button,
  Text,
  Input,
  FormControl,
  FormHelperText,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { HospitalityItem } from "@/types/hospitalityHub";
import { SpringModal } from "@/components/modals/springModal/SpringModal";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useState } from "react";

interface DeleteItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: HospitalityItem | null;
  onDeleted: () => void;
}

export default function DeleteItemModal({
  isOpen,
  onClose,
  item,
  onDeleted,
}: DeleteItemModalProps) {
  const toast = useToast();
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [confirmText, setConfirmText] = useState("");
  if (!item) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    const res = await fetch(`/api/hospitality-hub/items?id=${item.id}`, {
      method: "DELETE",
    });

    const data = await res.json();
    setIsDeleting(false);

    if (!res.ok) {
      toast({
        title: data.error || "Failed to delete item.",
        description: data.details,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
      return;
    }

    toast({
      title: "Item deleted successfully.",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom-right",
    });

    onDeleted();
    onClose();
  };

  return (
    <SpringModal
      isOpen={isOpen}
      onClose={onClose}
      showClose={true}
      header={"Delete Item"}
      body={
        <Text>Are you sure you want to delete {item.name}?</Text>
      }
      primaryLabel="Delete"
      onPrimaryClick={handleDelete}
      isPrimaryLoading={isDeleting}
      primaryDisabled={false}
      secondaryLabel="Cancel"
      onSecondaryClick={onClose}
      bg="red.600"
      frontIcon={<DeleteIcon fontSize="large" />}
      bgIcon={<DeleteIcon sx={{ fontSize: 160 }} />}
    />
  );
}
