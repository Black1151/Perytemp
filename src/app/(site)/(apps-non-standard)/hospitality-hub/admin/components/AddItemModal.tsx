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
import { HospitalityItem } from "@/types/hospitalityHub";

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryId: string;
  onCreated: () => void;
  item?: HospitalityItem | null;
}

interface FormValues {
  name: string;
  description: string;
  howToDetails: string;
  extraDetails: string;
  startDate: string;
  endDate: string;
  location: string;
  handlerEmail?: string;
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
  item,
}: AddItemModalProps) {
  const { register, handleSubmit, reset, setValue } = useForm<FormValues>();
  const toast = useToast();

  const { user } = useUser();

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [additionalFiles, setAdditionalFiles] = useState<File[]>([]);
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [coverUrl, setCoverUrl] = useState<string>("");
  const [additionalUrls, setAdditionalUrls] = useState<string[]>([]);

  // Helper to upload a file with a timestamp-based name
  const uploadFile = async (file: File): Promise<string> => {
    const fileName = `${Date.now()}-${file.name}`;
    const renamed = new File([file], fileName, { type: file.type });
    const formData = new FormData();
    formData.append("imageUrl", renamed);

    const res = await fetch(`/api/customer/uploadPhoto/${fileName}`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw data;
    return data.imageUrl || data.url || data.resource?.imageUrl || "";
  };

  const customerId = user?.customerId;
  const userId = user?.userId;

  useEffect(() => {
    if (customerId !== undefined) setValue("customerId", customerId);
    if (userId !== undefined) setValue("itemOwnerUserId", userId);
  }, [customerId, userId, setValue]);

  useEffect(() => {
    if (isOpen) {
      if (item) {
        setValue("name", item.name);
        setValue("description", item.description);
        setValue("howToDetails", item.howToDetails);
        setValue("extraDetails", item.extraDetails);
        setValue("handlerEmail", item.handlerEmail || "");
        setValue("startDate", item.startDate ? item.startDate.slice(0, 10) : "");
        setValue("endDate", item.endDate ? item.endDate.slice(0, 10) : "");
        setValue("location", item.location);
        setLogoUrl(item.logoImageUrl || "");
        setCoverUrl(item.coverImageUrl || "");
        setAdditionalUrls(item.additionalImageUrlList || []);
      } else {
        reset();
        setLogoUrl("");
        setCoverUrl("");
        setAdditionalUrls([]);
        setValue("handlerEmail", "");
        if (customerId !== undefined) setValue("customerId", customerId);
        if (userId !== undefined) setValue("itemOwnerUserId", userId);
      }
      setLogoFile(null);
      setCoverFile(null);
      setAdditionalFiles([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item, isOpen]);

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

    try {
      let logoImageUrl = logoUrl;
      let coverImageUrl = coverUrl;
      const additionalImageUrlList: string[] = [...additionalUrls];

      if (logoFile) {
        logoImageUrl = await uploadFile(logoFile);
      }

      if (coverFile) {
        coverImageUrl = await uploadFile(coverFile);
      }

      for (const file of additionalFiles) {
        const url = await uploadFile(file);
        if (url) additionalImageUrlList.push(url);
      }

      const method = item ? "PUT" : "POST";
      const body: any = {
        ...data,
        logoImageUrl,
        coverImageUrl,
        additionalImageUrlList,
        customerId,
        itemOwnerUserId: userId,
        hospitalityCatId: categoryId,
      };
      if (item) body.id = item.id;

      const res = await fetch("/api/hospitality-hub/items", {
        method,
        body: JSON.stringify(body),
      });

      const result = await res.json();

      if (!res.ok) {
        toast({
          title: result.error || (item ? "Failed to update item." : "Failed to create item."),
          description: result.details,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-right",
        });
        return;
      }

      toast({
        title: item ? "Item updated successfully." : "Item created successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });

      onCreated();
      reset();
      setLogoFile(null);
      setCoverFile(null);
      setAdditionalFiles([]);
      setLogoUrl("");
      setCoverUrl("");
      setAdditionalUrls([]);
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
        <ModalHeader>{item ? "Update Item" : "Create Item"}</ModalHeader>
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
              <FormLabel>Handler Email</FormLabel>
              <Input {...register("handlerEmail")} type="email" />
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
              {item ? "Update" : "Create"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
