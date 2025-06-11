"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Text,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { HospitalityItem } from "@/types/hospitalityHub";

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
  if (!item) return null;

  const handleDelete = async () => {
    const res = await fetch(`/api/hospitality-hub/items?id=${item.id}`, {
      method: "DELETE",
    });

    const data = await res.json();

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
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete Item</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Are you sure you want to delete {item.name}?</Text>
        </ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="red" onClick={handleDelete}>
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
