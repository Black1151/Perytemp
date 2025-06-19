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
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import ImageUploadWithCrop from "@/components/image/ImageUploadWithCrop";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
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
  customerId?: number;
  catOwnerUserId?: number;
}

export default function AddCategoryModal({
  isOpen,
  onClose,
  onCreated,
  category,
}: AddCategoryModalProps) {
  const { register, control, handleSubmit, reset, setValue } =
    useForm<FormValues>();
  const toast = useToast();

  const { user } = useUser();

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [teamMembers, setTeamMembers] = useState<BigUpTeamMember[]>([]);
  const [ownerOption, setOwnerOption] = useState<"me" | "other">("me");

  const customerId = user?.customerId;
  const userId = user?.userId;

  useEffect(() => {
    if (customerId !== undefined) setValue("customerId", customerId);
    if (ownerOption === "me" && userId !== undefined)
      setValue("catOwnerUserId", userId);
  }, [customerId, userId, ownerOption, setValue]);

  useEffect(() => {
    const fetchMembers = async () => {
      if (!isOpen || !customerId) return;
      try {
        const res = await fetch(`/api/getForTeamMemberInput?customerId=${customerId}`);
        const data = await res.json();
        if (res.ok) {
          const list = (data.resource ?? data) as any[];
          setTeamMembers(list);
        } else {
          toast({
            title: "Failed to fetch team members.",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-right",
          });
        }
      } catch (err) {
        console.error(err);
        toast({
          title: "Failed to fetch team members.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-right",
        });
      }
    };

    fetchMembers();
  }, [isOpen, customerId, toast]);


  useEffect(() => {
    if (isOpen) {
      setCoverFile(null);
      if (category) {
        setValue("name", category.name);
        setValue("description", category.description);
        const isMe =
          userId !== undefined &&
          String(category.catOwnerUserId) === String(userId);
        if (isMe) {
          setOwnerOption("me");
          if (userId !== undefined) setValue("catOwnerUserId", userId);
        } else {
          setOwnerOption("other");
          setValue("catOwnerUserId", Number(category.catOwnerUserId));
        }
      } else {
        reset();
        setOwnerOption("me");
        if (customerId !== undefined) setValue("customerId", customerId);
        if (userId !== undefined) setValue("catOwnerUserId", userId);
      }
    }
  }, [category, isOpen, customerId, userId, reset, setValue]);

  const onSubmit = async (data: FormValues) => {
    const method = category ? "PUT" : "POST";
    const formData = new FormData();

    if (ownerOption === "me" && userId !== undefined) {
      data.catOwnerUserId = userId;
    } else if (data.catOwnerUserId !== undefined) {
      data.catOwnerUserId = Number(data.catOwnerUserId);
    }

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        formData.append(key, String(value));
      }
    });

    if (customerId !== undefined)
      formData.append("customerId", String(customerId));
    if (data.catOwnerUserId !== undefined)
      formData.append("catOwnerUserId", String(data.catOwnerUserId));
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
            <FormControl mb={2}>
              <FormLabel>Owner</FormLabel>
              <RadioGroup
                value={ownerOption}
                onChange={(val) => {
                  setOwnerOption(val as "me" | "other");
                  if (val === "me" && userId !== undefined) {
                    setValue("catOwnerUserId", userId);
                  } else if (val === "other") {
                    setValue("catOwnerUserId", undefined);
                  }
                }}
              >
                <Stack direction="row">
                  <Radio value="me">Me!</Radio>
                  <Radio value="other">Someone else</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
            <FormControl
              mb={4}
              isRequired={ownerOption === "other"}
              isDisabled={ownerOption === "me"}
            >
              <FormLabel>Category Owner</FormLabel>
              <Controller
                name="catOwnerUserId"
                control={control}
                rules={{ required: ownerOption === "other" }}
                render={({ field }) => (
                  <TeamMemberAutocomplete
                    value={field.value?.toString() || ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    teamMembers={teamMembers}
                    placeholder="Search team member..."
                  />
                )}
              />
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
