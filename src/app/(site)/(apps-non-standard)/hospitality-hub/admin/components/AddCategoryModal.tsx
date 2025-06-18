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
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import { useMediaUploader } from "@/hooks/useMediaUploader";
import { HospitalityCategory } from "@/types/hospitalityHub";
import { BigUpTeamMember } from "../../../big-up/types";
import TeamMemberAutocomplete from "../../../big-up/components/TeamMemberAutocomplete";

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
  const [teamMembers, setTeamMembers] = useState<BigUpTeamMember[]>([]);

  const { uploadMediaFile } = useMediaUploader(
    "/api/hospitality-hub/uploadImage",
    "imageUrl",
    () => {},
    10 * 1024 * 1024,
  );

  const customerId = user?.customerId;
  const userId = user?.userId;

  const fetchTeamMembers = async () => {
    if (!customerId) return;
    try {
      const res = await fetch(
        `/api/user/allBy?customerId=${customerId}&selectColumns=id,firstName,lastName,imageUrl`,
      );
      const data = await res.json();
      if (res.ok) {
        setTeamMembers(
          (data.resource || []).map((u: any) => ({
            id: u.id,
            fullName: u.fullName || `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim(),
            imageUrl: u.imageUrl,
          })),
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (customerId !== undefined) setValue("customerId", customerId);
  }, [customerId, setValue]);

  useEffect(() => {
    if (isOpen) {
      fetchTeamMembers();
      if (category) {
        setValue("name", category.name);
        setValue("description", category.description);
        setValue("handlerEmail", category.handlerEmail || "");
        setImageUrl(category.imageUrl || "");
        setValue("catOwnerUserId", Number(category.catOwnerUserId));
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
      catOwnerUserId: data.catOwnerUserId,
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
            <FormControl mb={4} isRequired>
              <FormLabel>Owner</FormLabel>
              <Controller
                name="catOwnerUserId"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TeamMemberAutocomplete
                    value={value ? String(value) : ""}
                    onChange={(val) => onChange(Number(val))}
                    onBlur={onBlur}
                    teamMembers={teamMembers}
                    placeholder="Start typing to search..."
                  />
                )}
              />
            </FormControl>
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
            <ImageUploadWithCrop
              label="Image"
              onFileSelected={async (file) => {
                if (!file) return;
                const data = await uploadMediaFile(file);
                setImageUrl(data.imageUrl);
              }}
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
