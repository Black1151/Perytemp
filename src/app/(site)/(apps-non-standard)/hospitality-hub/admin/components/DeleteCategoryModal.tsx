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
  Spinner,
} from "@chakra-ui/react";
import { HospitalityCategory } from "@/types/hospitalityHub";
import useHospitalityItems from "../../hooks/useHospitalityItems";
import { useToast } from "@chakra-ui/react";

interface DeleteCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: HospitalityCategory | null;
  onDeleted: () => void;
}

export default function DeleteCategoryModal({
  isOpen,
  onClose,
  category,
  onDeleted,
}: DeleteCategoryModalProps) {
  const toast = useToast();
  const { items, loading } = useHospitalityItems(
    isOpen && category ? category.id : undefined,
  );

  if (!category) return null;

  const handleDelete = async () => {
    const res = await fetch(
      `/api/hospitality-hub/categories/${category.id}`,
      {
        method: "DELETE",
      },
    );

    const data = await res.json();

    if (!res.ok) {
      toast({
        title: data.error || "Failed to delete category.",
        description: data.details,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
      return;
    }

    toast({
      title: "Category deleted successfully.",
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
        <ModalHeader>Delete Category</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            Are you sure you want to delete {category.name}?
          </Text>
          {loading ? (
            <Spinner size="sm" mt={2} />
          ) : items.length > 0 ? (
            <Text mt={2}>
              This category contains {items.length} item
              {items.length === 1 ? "" : "s"} which will also be deleted.
            </Text>
          ) : null}
        </ModalBody>
        <ModalFooter>
          <Button mr={3} variant="primary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleDelete}>
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
