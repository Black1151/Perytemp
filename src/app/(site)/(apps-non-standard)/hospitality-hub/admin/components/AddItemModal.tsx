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
  Textarea,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import DragDropFileUpload from "@/components/forms/DragDropFileUpload";

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryId: string;
  onCreated: () => void;
}

interface FormValues {
  name: string;
  description: string;
  howToDetails: string;
  extraDetails: string;
  startDate: string;
  endDate: string;
  location: string;
  customerId?: number;
  itemOwnerUserId?: number;
  logoImageUrl?: string;
  coverImageUrl?: string;
  additionalImageUrlList?: string[];
}

export default function AddItemModal({
  isOpen,
  onClose,
  categoryId,
  onCreated,
}: AddItemModalProps) {
  const { register, handleSubmit, reset, setValue } = useForm<FormValues>();
  const toast = useToast();

  const { user } = useUser();

  const [logoImageUrl, setLogoImageUrl] = useState<string>("");
  const [coverImageUrl, setCoverImageUrl] = useState<string>("");
  const [additionalImageUrlList, setAdditionalImageUrlList] = useState<
    string[]
  >([]);

  const customerId = user?.customerId;
  const userId = user?.userId;

  useEffect(() => {
    if (customerId !== undefined) setValue("customerId", customerId);
    if (userId !== undefined) setValue("itemOwnerUserId", userId);
  }, [customerId, userId, setValue]);

  const onSubmit = async (data: FormValues) => {
    const res = await fetch("/api/customer/uploadPhoto/", {
      method: "POST",
      body: JSON.stringify({
        ...data,
        logoImageUrl,
        coverImageUrl,
        additionalImageUrlList,
        customerId,
        itemOwnerUserId: userId,
        hospitalityCatId: categoryId,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      toast({
        title: result.error || "Failed to create item.",
        description: result.details,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
      return;
    }

    onCreated();
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Item</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <input type="hidden" {...register("customerId")} />
            <input type="hidden" {...register("itemOwnerUserId")} />
            <FormControl mb={4} isRequired>
              <FormLabel>Name</FormLabel>
              <Input {...register("name", { required: true })} />
            </FormControl>
            <FormControl mb={4} isRequired>
              <FormLabel>Description</FormLabel>
              <Textarea {...register("description", { required: true })} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>How To Details</FormLabel>
              <Textarea {...register("howToDetails")} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Extra Details</FormLabel>
              <Textarea {...register("extraDetails")} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Start Date</FormLabel>
              <Input type="date" {...register("startDate")} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>End Date</FormLabel>
              <Input type="date" {...register("endDate")} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Location</FormLabel>
              <Input {...register("location")} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Logo Image</FormLabel>
              <DragDropFileUpload
                uploadEndpoint="/api/customer/uploadPhoto/"
                formKey="imageUrl"
                placeholder="Drag & drop logo here"
                onUploadComplete={(url) => setLogoImageUrl(url)}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Cover Image</FormLabel>
              <DragDropFileUpload
                uploadEndpoint="/api/customer/uploadPhoto/"
                formKey="imageUrl"
                placeholder="Drag & drop cover image here"
                onUploadComplete={(url) => setCoverImageUrl(url)}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Additional Images</FormLabel>
              <DragDropFileUpload
                uploadEndpoint="/api/customer/uploadPhoto/"
                formKey="imageUrl"
                multiple
                placeholder="Drag & drop additional images"
                onUploadComplete={(url) =>
                  setAdditionalImageUrlList((prev) => [...prev, url])
                }
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" colorScheme="blue">
              Create
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
