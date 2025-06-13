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
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import { useMediaUploader } from "@/hooks/useMediaUploader";
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
  handlerEmail?: string;
  customerId?: number;
  catOwnerUserId?: number;
  imageUrl?: string;
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

  const [imageUrl, setImageUrl] = useState<string>("");

  const { uploadMediaFile, isUploading } = useMediaUploader(
    "/api/hospitality-hub/uploadImage",
    "imageUrl",
    () => {},
  );

  const customerId = user?.customerId;
  const userId = user?.userId;

  useEffect(() => {
    if (customerId !== undefined) setValue("customerId", customerId);
    if (userId !== undefined) setValue("catOwnerUserId", userId);
  }, [customerId, userId, setValue]);

  useEffect(() => {
    if (isOpen) {
      if (category) {
        setValue("name", category.name);
        setValue("description", category.description);
        setValue("handlerEmail", category.handlerEmail || "");
        setImageUrl(category.imageUrl || "");
      } else {
        reset();
        setImageUrl("");
        setValue("handlerEmail", "");
        if (customerId !== undefined) setValue("customerId", customerId);
        if (userId !== undefined) setValue("catOwnerUserId", userId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, isOpen]);

  const onSubmit = async (data: FormValues) => {
    const method = category ? "PUT" : "POST";
    const body = {
      ...data,
      imageUrl,
      customerId,
      catOwnerUserId: userId,
    } as any;
    if (category) {
      (body as any).id = category.id;
    }

    const res = await fetch("/api/hospitality-hub/categories", {
      method,
      body: JSON.stringify(body),
    });

    const result = await res.json();

    if (!res.ok) {
      toast({
        title:
          result.error ||
          (category ? "Failed to update category." : "Failed to create category."),
        description: result.details,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
      return;
    }

    toast({
      title: category ? "Category updated successfully." : "Category created successfully.",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom-right",
    });

    onCreated();
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{category ? "Update Category" : "Create Category"}</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit(onSubmit)}>
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
            <FormControl mb={4}>
              <FormLabel>Handler Email</FormLabel>
              <Input {...register("handlerEmail")} type="email" />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Image</FormLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const data = await uploadMediaFile(file);
                  setImageUrl(data.imageUrl);
                  e.target.value = "";
                }}
                disabled={isUploading}
              />
            </FormControl>
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
