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
import { useMediaUploader } from "@/hooks/useMediaUploader";

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

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [additionalFiles, setAdditionalFiles] = useState<File[]>([]);

  const uploadEndpoint = user?.customerUniqueId
    ? `/api/customer/uploadPhoto/${user.customerUniqueId}`
    : "";
  const { uploadMediaFile } = useMediaUploader(uploadEndpoint, "imageUrl", () => {});

  const customerId = user?.customerId;
  const userId = user?.userId;

  useEffect(() => {
    if (customerId !== undefined) setValue("customerId", customerId);
    if (userId !== undefined) setValue("itemOwnerUserId", userId);
  }, [customerId, userId, setValue]);

  const onSubmit = async (data: FormValues) => {
    if (!user?.customerUniqueId) {
      toast({
        title: "Missing customer information.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
      return;
    }

    const extractUrl = (d: any): string =>
      d.imageUrl || d.url || d.resource?.imageUrl || "";

    try {
      let logoImageUrl = "";
      let coverImageUrl = "";
      const additionalImageUrlList: string[] = [];

      if (logoFile) {
        const renamed = new File([logoFile], `${Date.now()}-${logoFile.name}`, {
          type: logoFile.type,
        });
        const resp = await uploadMediaFile(renamed);
        logoImageUrl = extractUrl(resp);
      }

      if (coverFile) {
        const renamed = new File([coverFile], `${Date.now()}-${coverFile.name}`, {
          type: coverFile.type,
        });
        const resp = await uploadMediaFile(renamed);
        coverImageUrl = extractUrl(resp);
      }

      for (const file of additionalFiles) {
        const renamed = new File([file], `${Date.now()}-${file.name}`, {
          type: file.type,
        });
        const resp = await uploadMediaFile(renamed);
        const url = extractUrl(resp);
        if (url) additionalImageUrlList.push(url);
      }

      const res = await fetch("/api/hospitality-hub/items", {
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
      setLogoFile(null);
      setCoverFile(null);
      setAdditionalFiles([]);
      onClose();
    } catch (err) {
      console.error(err);
      toast({
        title: "Failed to upload images.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
    }
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
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setLogoFile(file);
                }}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Cover Image</FormLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setCoverFile(file);
                }}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Additional Images</FormLabel>
              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setAdditionalFiles(files);
                }}
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
