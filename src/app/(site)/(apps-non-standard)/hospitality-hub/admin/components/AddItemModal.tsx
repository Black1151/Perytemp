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
  Checkbox,
  VStack,
  useToast,
} from "@chakra-ui/react";
import ImageUploadWithCrop from "@/components/image/ImageUploadWithCrop";
import DragDropFileInput from "@/components/forms/DragDropFileInput";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { HospitalityItem } from "@/types/hospitalityHub";
import { Site } from "@/types/types";
import { BigUpTeamMember } from "../../../big-up/types";
import TeamMemberAutocomplete from "../../../big-up/components/TeamMemberAutocomplete";

/**
 * Updated AddItemModal that integrates TeamMemberAutocomplete as a controlled
 * input managed by React‑Hook‑Form's Controller.
 */

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryId: string;
  onCreated: () => void;
  // teamMembers: BigUpTeamMember[];
  item?: HospitalityItem | null;
}

interface FormValues {
  name: string;
  description: string;
  itemType: string;
  howToDetails: string;
  extraDetails: string;
  // startDate: string;
  // endDate: string;
  selectedSites: number[];
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
  const { register, control, handleSubmit, reset, setValue } =
    useForm<FormValues>({
      defaultValues: {
        name: "",
        description: "",
        itemType: "singleDayBookable",
        howToDetails: "",
        extraDetails: "",
        // startDate: "",
        // endDate: "",
        selectedSites: [],
      },
    });

  const toast = useToast();
  const { user } = useUser();

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [additionalFiles, setAdditionalFiles] = useState<File[]>([]);
  const [existingLogoUrl, setExistingLogoUrl] = useState<string | null>(null);
  const [existingCoverUrl, setExistingCoverUrl] = useState<string | null>(null);
  const [removeLogoUrl, setRemoveLogoUrl] = useState<string | null>(null);
  const [removeCoverUrl, setRemoveCoverUrl] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<BigUpTeamMember[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedSitesState, setSelectedSitesState] = useState<number[]>([]);

  useEffect(() => {
    setValue("selectedSites", selectedSitesState);
  }, [selectedSitesState, setValue]);

  const customerId = user?.customerId;
  const userId = user?.userId;

  /**
   * Sync hidden defaults once customer & user IDs become available
   */
  useEffect(() => {
    if (customerId !== undefined) setValue("customerId", customerId);
    if (userId !== undefined) setValue("itemOwnerUserId", userId);
  }, [customerId, userId, setValue]);

  /**
   * Fetch team members for the autocomplete when the modal opens
   */
  useEffect(() => {
    const fetchMembers = async () => {
      if (!isOpen || !customerId) return;
      try {
        const res = await fetch(
          `/api/getForTeamMemberInput?customerId=${customerId}`
        );
        const data = await res.json();
        if (res.ok) {
          const list = (data.resource ?? data) as any[];

          console.log("list", list);
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

  /**
   * Fetch sites when the modal opens
   */
  useEffect(() => {
    const fetchSites = async () => {
      if (!isOpen) return;
      try {
        const res = await fetch(
          "/api/site/allBy?selectColumns=id,siteName",
        );
        const data = await res.json();
        if (res.ok) {
          setSites(data.resource || []);
        } else {
          console.error("Failed to fetch sites", data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchSites();
  }, [isOpen]);

  /**
   * Populate form when opening modal for editing / reset when creating
   */
  useEffect(() => {
    if (!isOpen) return;

    if (item) {
      setValue("name", item.name);
      setValue("description", item.description);
      setValue("howToDetails", item.howToDetails || "");
      setValue("itemType", item.itemType);
      setValue("extraDetails", item.extraDetails || "");
      // setValue("startDate", item.startDate ? item.startDate.slice(0, 10) : "");
      // setValue("endDate", item.endDate ? item.endDate.slice(0, 10) : "");
      setValue("itemOwnerUserId", Number(item.itemOwnerUserId));
      setExistingLogoUrl(item.logoImageUrl || null);
      setExistingCoverUrl(item.coverImageUrl || null);
      // @ts-ignore - selectedSites may come from backend
      if (item.selectedSites) {
        setSelectedSitesState(
          (item.selectedSites as any[]).map((s) => Number(s)),
        );
      }
    } else {
      reset({
        name: "",
        description: "",
        itemType: "singleDayBookable",
        howToDetails: "",
        extraDetails: "",
        // startDate: "",
        // endDate: "",
        selectedSites: [],
        customerId: customerId ?? undefined,
        itemOwnerUserId: userId ?? undefined,
      });
      setSelectedSitesState([]);
      setExistingLogoUrl(null);
      setExistingCoverUrl(null);
    }

    setLogoFile(null);
    setCoverFile(null);
    setAdditionalFiles([]);
    setRemoveLogoUrl(null);
    setRemoveCoverUrl(null);
    // eslint‑disable‑next‑line react‑hooks/exhaustive‑deps
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

    if (removeLogoUrl && !logoFile) {
      toast({
        title: "Logo image required",
        description:
          "Please upload a new logo image after removing the existing one.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
      return;
    }

    if (removeCoverUrl && !coverFile) {
      toast({
        title: "Cover image required",
        description:
          "Please upload a new cover image after removing the existing one.",
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

      // Append simple primitives first
      Object.entries(data).forEach(([key, value]) => {
        if (key === "selectedSites") return;
        if (value !== undefined && value !== null && value !== "") {
          formData.append(key, String(value));
        }
      });
      selectedSitesState.forEach((id) => {
        formData.append("selectedSites[]", String(id));
      });

      // Append IDs that may not be present in data yet
      if (customerId !== undefined)
        formData.append("customerId", String(customerId));
      if (data.itemOwnerUserId !== undefined)
        formData.append("itemOwnerUserId", String(data.itemOwnerUserId));
      formData.append("hospitalityCatId", categoryId);
      if (item) formData.append("id", item.id);

      // Images
      if (logoFile) formData.append("logoImageUpload", logoFile);
      if (coverFile) formData.append("coverImageUpload", coverFile);
      additionalFiles.forEach((file) => {
        formData.append("AdditionalImagesListUpload[]", file);
      });

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
            {/* Hidden fields */}
            <input type="hidden" {...register("customerId")} />
            <input type="hidden" {...register("itemOwnerUserId")} />

            {/* Name */}
            <FormControl mb={4} isRequired>
              <FormLabel>Name</FormLabel>
              <Input {...register("name", { required: true })} />
            </FormControl>

            {/* Description */}
            <FormControl mb={4} isRequired>
              <FormLabel>Description</FormLabel>
              <Textarea {...register("description", { required: true })} />
            </FormControl>

            {/* Item Type */}
            <FormControl mb={4}>
              <FormLabel>Item Type</FormLabel>
              <Select {...register("itemType")}>
                <option value="singleDayBookable">Single Day Bookable</option>
                <option value="singleDayBookableWithStartEnd">
                  Single Day Bookable With Start and End
                </option>
                <option value="multiDayBookable">Multi Day Bookable</option>
                <option value="registerInterest">Register Interest</option>
                <option value="info">Info</option>
              </Select>
            </FormControl>

            {/* How To Details */}
            <FormControl mb={4}>
              <FormLabel>How To Details</FormLabel>
              <Textarea {...register("howToDetails")} />
            </FormControl>

            {/* Extra Details */}
            <FormControl mb={4}>
              <FormLabel>Extra Details</FormLabel>
              <Textarea {...register("extraDetails")} />
            </FormControl>

            {/* Start/End Dates */}
            {/* <FormControl mb={4}>
              <FormLabel>Start Date</FormLabel>
              <Input type="date" {...register("startDate")} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>End Date</FormLabel>
              <Input type="date" {...register("endDate")} />
            </FormControl> */}

            {/* Sites */}
            <FormControl mb={4}>
              <FormLabel>Sites</FormLabel>
              <Checkbox
                isChecked={
                  selectedSitesState.length === sites.length && sites.length > 0
                }
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedSitesState(sites.map((s) => s.id));
                  } else {
                    setSelectedSitesState([]);
                  }
                }}
              >
                Select All
              </Checkbox>
              <VStack align="start" pl={4} mt={2} spacing={1}>
                {sites.map((site) => (
                  <Checkbox
                    key={site.id}
                    isChecked={selectedSitesState.includes(site.id)}
                    onChange={() =>
                      setSelectedSitesState((prev) =>
                        prev.includes(site.id)
                          ? prev.filter((id) => id !== site.id)
                          : [...prev, site.id]
                      )
                    }
                  >
                    {site.siteName}
                  </Checkbox>
                ))}
              </VStack>
            </FormControl>

            {/* Item Owner (Team Member Autocomplete) */}
            <FormControl mb={4} isRequired>
              <FormLabel>Item Owner</FormLabel>

              <Controller
                name="itemOwnerUserId"
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

            {/* Images */}
            <ImageUploadWithCrop
              label="Logo Image"
              onFileSelected={(file) => setLogoFile(file)}
              isRequired={!existingLogoUrl}
              existingUrl={existingLogoUrl || undefined}
              onRemoveExisting={() => {
                if (existingLogoUrl) setRemoveLogoUrl(existingLogoUrl);
                setExistingLogoUrl(null);
              }}
            />
            <ImageUploadWithCrop
              label="Cover Image"
              onFileSelected={(file) => setCoverFile(file)}
              isRequired={!existingCoverUrl}
              existingUrl={existingCoverUrl || undefined}
              onRemoveExisting={() => {
                if (existingCoverUrl) setRemoveCoverUrl(existingCoverUrl);
                setExistingCoverUrl(null);
              }}
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
