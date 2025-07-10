"use client";

import {
  Text,
  Spinner,
  Input,
  FormControl,
  FormHelperText,
  useTheme,
} from "@chakra-ui/react";
import { HospitalityCategory } from "@/types/hospitalityHub";
import useHospitalityItems from "../../hooks/useHospitalityItems";
import { useToast } from "@chakra-ui/react";
import { SpringModal } from "@/components/modals/springModal/SpringModal";
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";

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
    isOpen && category ? category.id : undefined
  );
  const theme = useTheme()

  const [isDeleting, setIsDeleting] = React.useState(false);
  const [confirmText, setConfirmText] = React.useState("");

  if (!category) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    const res = await fetch(`/api/hospitality-hub/categories/${category.id}`, {
      method: "DELETE",
    });

    const data = await res.json();
    setIsDeleting(false);

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
    <SpringModal
      isOpen={isOpen}
      onClose={onClose}
      showClose={true}
      header={"Delete Category"}
      body={
        <>
          <Text>Are you sure you want to delete {category.name}?</Text>
          {loading ? (
            <Spinner size="sm" mt={2} />
          ) : items.length > 0 ? (
            <Text mt={2}>
              This category contains {items.length} item
              {items.length === 1 ? "" : "s"} which will also be deleted.
            </Text>
          ) : null}
          <FormControl mt={4}>
            <Input
              placeholder={`Type '${category.name}' to confirm`}
              value={confirmText}
              onChange={e => setConfirmText(e.target.value)}
              color={"rgb(255,255,255)"}
              _placeholder={{ color: "rgb(255,255,255,0.8)" }}
            />
            <FormHelperText color="red.200">
              You must type the category name exactly to confirm deletion.
            </FormHelperText>
          </FormControl>
        </>
      }
      primaryLabel="Delete"
      onPrimaryClick={handleDelete}
      isPrimaryLoading={isDeleting}
      primaryDisabled={confirmText !== category.name}
      secondaryLabel="Cancel"
      onSecondaryClick={onClose}
      bg="red.600"
      frontIcon={<DeleteIcon fontSize="large" />}
      bgIcon={<DeleteIcon sx={{ fontSize: 160 }} />}
    />
  );
}
