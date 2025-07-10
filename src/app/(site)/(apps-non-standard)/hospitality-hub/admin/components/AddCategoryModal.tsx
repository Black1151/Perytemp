"use client";

import { useUser } from "@/providers/UserProvider";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Stack,
  useTheme,
  Box,
  VStack,
} from "@chakra-ui/react";
import ImageUploadWithCrop from "@/components/image/ImageUploadWithCrop";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import { HospitalityCategory } from "@/types/hospitalityHub";
import { BigUpTeamMember } from "../../../big-up/types";
import TeamMemberAutocomplete from "../../../big-up/components/TeamMemberAutocomplete";
import SinglePaneModal from "@/components/modals/SinglePaneModal";
import { transparentize } from "@chakra-ui/theme-tools";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (category: HospitalityCategory) => void;
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
  const { register, control, handleSubmit, reset, setValue, formState: { errors } } =
    useForm<FormValues>();
  const toast = useToast();

  const { user } = useUser();

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [teamMembers, setTeamMembers] = useState<BigUpTeamMember[]>([]);
  const [ownerOption, setOwnerOption] = useState<"me" | "other">("me");

  const customerId = user?.customerId;
  const userId = user?.userId;

  const theme = useTheme();

  useEffect(() => {
    if (customerId !== undefined) setValue("customerId", customerId);
    if (ownerOption === "me" && userId !== undefined)
      setValue("catOwnerUserId", userId);
  }, [customerId, userId, ownerOption, setValue]);

  useEffect(() => {
    const fetchMembers = async () => {
      if (!isOpen || !customerId) return;
      try {
        const res = await fetch(
          `/api/getForTeamMemberInput?customerId=${customerId}`,
        );
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

    if (!category && !coverFile) {
      toast({
        title: "Image is required.",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom-right",
      });
      return;
    }

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

    try {
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

      onCreated(result.resource || result);
      reset();
      setCoverFile(null);
      onClose();
    } catch (err) {
      console.error(err);
      toast({
        title: "Failed to upload image.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
    }
  };

  return (
    <SinglePaneModal
      isOpen={isOpen}
      onClose={onClose}
      icon={null}
      title={category ? "Update Category" : "Create Category"}
      panel={
        <Box
          p={4}
          border="1px solid"
          borderColor={transparentize(theme.colors.primaryTextColor, 0.15)(theme)}
          borderRadius="md"
          bg={theme.colors.elementBG}
        >
          <form id="add-category-form" onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
            <VStack align="stretch" spacing={4}>
              <input type="hidden" {...register("customerId")} />
              <input type="hidden" {...register("catOwnerUserId")} />
              <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Box color={theme.colors.secondaryTextColor} fontSize="sm" mb={2}>
                  Enter a short, descriptive name for this category. (Required, 3-30 characters)
                </Box>
                <Input
                  {...register("name", {
                    required: "Name is required.",
                    minLength: { value: 3, message: "Name must be at least 3 characters." },
                    maxLength: { value: 30, message: "Name must be at most 30 characters." },
                  })}
                />
                {errors.name && (
                  <Box color="red.500" fontSize="sm">
                    {errors.name.message}
                  </Box>
                )}
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Description</FormLabel>
                <Box color={theme.colors.secondaryTextColor} fontSize="sm" mb={2}>
                  Provide a brief description of what this category is for. (Required, 80-500 characters)
                </Box>
                <Input
                  {...register("description", {
                    required: "Description is required.",
                    minLength: { value: 80, message: "Description must be at least 80 characters." },
                    maxLength: { value: 500, message: "Description must be at most 500 characters." },
                  })}
                />
                {errors.description && (
                  <Box color="red.500" fontSize="sm">
                    {errors.description.message}
                  </Box>
                )}
              </FormControl>
              <FormControl>
                <FormLabel>Owner</FormLabel>
                <Box color={theme.colors.secondaryTextColor} fontSize="sm" mb={2}>
                  The selected owner will receive notifications about this category. Choose "Me!" to assign yourself, or "Someone else" to select a different team member.
                </Box>
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
              {ownerOption === "other" && (
                <FormControl isRequired>
                  <FormLabel>Category Owner</FormLabel>
                  <Box color={theme.colors.secondaryTextColor} fontSize="sm" mb={2}>
                    Start typing to search and select the team member who should receive notifications for this category.
                  </Box>
                  <Controller
                    name="catOwnerUserId"
                    control={control}
                    rules={{ required: true }}
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
              )}
              <FormLabel mb={-2} mt={2}>Image</FormLabel>
              <Box color={theme.colors.secondaryTextColor} fontSize="sm" mb={2}>
                Please upload a high-quality image for this category. This image will represent the category in listings and should be visually clear at different sizes. (Required)
              </Box>
              <ImageUploadWithCrop
                label=""
                onFileSelected={(file) => setCoverFile(file)}
                isRequired={true}
                existingUrl={category?.coverImageUrl}
                onRemoveExisting={() => setCoverFile(null)}
              />
            </VStack>
          </form>
        </Box>
      }
      footer={
        <Button type="submit" form="add-category-form" variant="primary">
          {category ? "Update" : "Create"}
        </Button>
      }
    />
  );
}
