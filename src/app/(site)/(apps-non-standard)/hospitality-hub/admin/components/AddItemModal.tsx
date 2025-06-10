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

  const { user } = useUser();

  const [logoImageUrl, setLogoImageUrl] = useState<string>("");
  const [coverImageUrl, setCoverImageUrl] = useState<string>("");
  const [additionalImageUrlList, setAdditionalImageUrlList] = useState<string[]>([]);

  const {
    uploadMediaFile: uploadLogo,
    isUploading: uploadingLogo,
  } = useMediaUploader("/api/hospitality-hub/uploadImage", "imageUrl", () => {});
  const {
    uploadMediaFile: uploadCover,
    isUploading: uploadingCover,
  } = useMediaUploader("/api/hospitality-hub/uploadImage", "imageUrl", () => {});
  const {
    uploadMediaFile: uploadAdditional,
    isUploading: uploadingAdditional,
  } = useMediaUploader("/api/hospitality-hub/uploadImage", "imageUrl", () => {});

  const customerId = user?.customerId;
  const userId = user?.userId;

  useEffect(() => {
    if (customerId !== undefined) setValue("customerId", customerId);
    if (userId !== undefined) setValue("itemOwnerUserId", userId);
  }, [customerId, userId, setValue]);

  const onSubmit = async (data: FormValues) => {
    await fetch("/api/hospitality-hub/items", {
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
              <Input {...register("description", { required: true })} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>How To Details</FormLabel>
              <Input {...register("howToDetails")} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Extra Details</FormLabel>
              <Input {...register("extraDetails")} />
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
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const data = await uploadLogo(file);
                  setLogoImageUrl(data.imageUrl);
                  e.target.value = "";
                }}
                disabled={uploadingLogo}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Cover Image</FormLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const data = await uploadCover(file);
                  setCoverImageUrl(data.imageUrl);
                  e.target.value = "";
                }}
                disabled={uploadingCover}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Additional Images</FormLabel>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={async (e) => {
                  const files = Array.from(e.target.files || []);
                  const urls: string[] = [];
                  for (const file of files) {
                    const data = await uploadAdditional(file as File);
                    urls.push(data.imageUrl);
                  }
                  setAdditionalImageUrlList((prev) => [...prev, ...urls]);
                  e.target.value = "";
                }}
                disabled={uploadingAdditional}
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
