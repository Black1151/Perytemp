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
  Select,
} from "@chakra-ui/react";
import ImageUploadWithCrop from "@/components/image/ImageUploadWithCrop";
import DragDropFileInput from "@/components/forms/DragDropFileInput";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import { HospitalityItem } from "@/types/hospitalityHub";
import UserSearchAutocomplete, { AutocompleteUser } from "@/components/forms/UserSearchAutocomplete";

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
  itemType: string;
  howToDetails: string;
  extraDetails: string;
  startDate: string;
  endDate: string;
  location: string;
  handlerEmail?: string;
  customerId?: number;
  itemOwnerUserId?: number;
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
        setValue("itemType", item.itemType);
        setValue("extraDetails", item.extraDetails);
        setValue("handlerEmail", item.handlerEmail || "");
        setValue(
          "startDate",
          item.startDate ? item.startDate.slice(0, 10) : ""
        );
        setValue("endDate", item.endDate ? item.endDate.slice(0, 10) : "");
        setValue("location", item.location);
        // Existing images are ignored when editing; handled server-side
      } else {
        reset();
        // reset image selections
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
      const method = item ? "PUT" : "POST";
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          formData.append(key, value as any);
        }
      });

      if (customerId !== undefined)
        formData.append("customerId", String(customerId));
      if (userId !== undefined)
        formData.append("itemOwnerUserId", String(userId));
      formData.append("hospitalityCatId", categoryId);
      if (logoFile) formData.append("logoImageUpload", logoFile);
      if (coverFile) formData.append("coverImageUpload", coverFile);
      if (item) formData.append("id", item.id);

      const res = await fetch("/api/hospitality-hub/items", {
        method,
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        toast({
          title:
            result.error ||
            (item ? "Failed to update item." : "Failed to create item."),
          description: result.details,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-right",
        });
        return;
      }

      toast({
        title: item
          ? "Item updated successfully."
          : "Item created successfully.",
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
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
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
              <FormLabel>Item Type</FormLabel>
              <Select {...register("itemType")}>
                <option value="event">Event</option>
                <option value="booking">Booking</option>
                <option value="information">Information</option>
                <option value="other">Other</option>
              </Select>
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
              <FormLabel>Owner Email</FormLabel>
              <Controller
                name="handlerEmail"
                control={control}
                render={({ field: { value } }) => (
                  <UserSearchAutocomplete
                    value={value}
                    onSelect={(u: AutocompleteUser) => {
                      setValue("handlerEmail", u.email);
                      setValue("itemOwnerUserId", u.id);
                    }}
                  />
                )}
              />
            </FormControl>
            <ImageUploadWithCrop
              label="Logo Image"
              onFileSelected={(file) => setLogoFile(file)}
            />
            <ImageUploadWithCrop
              label="Cover Image"
              onFileSelected={(file) => setCoverFile(file)}
            />
            <FormControl mb={4}>
              <FormLabel>Additional Images</FormLabel>
              <DragDropFileInput
                multiple
                placeholder="Drag & drop additional images here"
                onFilesSelected={(files) => setAdditionalFiles(files)}
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
