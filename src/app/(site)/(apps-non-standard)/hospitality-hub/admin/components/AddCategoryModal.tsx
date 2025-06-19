"use client";

import { useUser } from "@/providers/UserProvider";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import ImageUploadWithCrop from "@/components/image/ImageUploadWithCrop";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import { HospitalityCategory } from "@/types/hospitalityHub";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
  category?: HospitalityCategory | null;
}

interface FormValues {
  name: string;
  description: string;
  customerId?: number;
  catOwnerUserId?: number;
}

export default function AddCategoryModal({
  isOpen,
  onClose,
  onCreated,
  category,
}: AddCategoryModalProps) {
  const { register, handleSubmit, reset, setValue } = useForm<FormValues>();
  const toast = useToast();

  const { user } = useUser();

  const [coverFile, setCoverFile] = useState<File | null>(null);

  const customerId = user?.customerId;
  const userId = user?.userId;

  useEffect(() => {
    if (customerId !== undefined) setValue("customerId", customerId);
    if (userId !== undefined) setValue("catOwnerUserId", userId);
  }, [customerId, userId, setValue]);

  useEffect(() => {
    if (isOpen) {
      setCoverFile(null);
      if (category) {
        setValue("name", category.name);
        setValue("description", category.description);
      } else {
        reset();
        if (customerId !== undefined) setValue("customerId", customerId);
        if (userId !== undefined) setValue("catOwnerUserId", userId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, isOpen]);

  const onSubmit = async (data: FormValues) => {
    const method = category ? "PUT" : "POST";
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        formData.append(key, String(value));
      }
    });

    if (customerId !== undefined)
      formData.append("customerId", String(customerId));
    if (userId !== undefined) formData.append("catOwnerUserId", String(userId));
    if (category) formData.append("id", category.id);
    if (coverFile) formData.append("coverImageUpload", coverFile);

    const res = await fetch("/api/hospitality-hub/categories", {
      method,
      body: formData,
    });

    const result = await res.json();

    if (!res.ok) {
      toast({
        title:
          result.error ||
          (category
            ? "Failed to update category."
            : "Failed to create category."),
        description: result.details,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
      return;
    }

    toast({
      title: category
        ? "Category updated successfully."
        : "Category created successfully.",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom-right",
    });

    onCreated();
    reset();
    setCoverFile(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {category ? "Update Category" : "Create Category"}
        </ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <ModalBody>
            <input type="hidden" {...register("customerId")} />
            <input type="hidden" {...register("catOwnerUserId")} />
            <FormControl mb={4} isRequired>
              <FormLabel>Name</FormLabel>
              <Input {...register("name", { required: true })} />
            </FormControl>
            <FormControl mb={4} isRequired>
              <FormLabel>Description</FormLabel>
              <Input {...register("description", { required: true })} />
            </FormControl>
            <ImageUploadWithCrop
              label="Image"
              onFileSelected={(file) => setCoverFile(file)}
            />
          </ModalBody>
          <ModalFooter>
            <Button type="submit" colorScheme="blue">
              {category ? "Update" : "Create"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
