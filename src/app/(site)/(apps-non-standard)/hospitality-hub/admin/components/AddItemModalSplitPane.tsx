"use client";

import { useState, useEffect } from "react";
import SplitPaneModal from "@/components/modals/SplitPaneModal";
import {
  useForm,
  FormProvider,
  useFormContext,
  Controller,
} from "react-hook-form";
import {
  Box,
  Button,
  VStack,
  Checkbox,
  Spinner,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Radio,
  RadioGroup,
  Stack,
  useToast,
  Badge,
  useTheme,
  useBreakpointValue,
} from "@chakra-ui/react";
import ImageUploadWithCrop from "@/components/image/ImageUploadWithCrop";
import DragDropFileInput from "@/components/forms/DragDropFileInput";
import TeamMemberAutocomplete from "../../../big-up/components/TeamMemberAutocomplete";
import { Site } from "@/types/types";
import { BigUpTeamMember } from "../../../big-up/types";
import { HospitalityItem } from "@/types/hospitalityHub";
import { useUser } from "@/providers/UserProvider";
import { BusinessOutlined } from "@mui/icons-material";
import { motion } from "framer-motion";
import SectionBasicInfo from "./SectionBasicInfo";
import SectionSites from "./SectionSites";
import SectionOwner from "./SectionOwner";
import SectionImages from "./SectionImages";
import { transparentize } from "@chakra-ui/theme-tools";
import SectionLocation from "./SectionLocation";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckIcon from "@mui/icons-material/Check";
import ItemDetailModal from "../../app/components/ItemDetailModal/ItemDetailModal";

export interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryId: string;
  catOwnerUserId: string;
  onCreated: () => void;
  item?: HospitalityItem | null;
}

export { AddItemModalSplitPane as default };

const SECTIONS = [
  { id: "basic", label: "Basic Info" },
  { id: "location", label: "Location" },
  { id: "owner", label: "Owner" },
  { id: "images", label: "Images" },
];

// Inline checkmark icon for completed sections
const CheckCircleIcon = (props: any) => (
  <svg
    viewBox="0 0 20 20"
    fill="currentColor"
    width="1em"
    height="1em"
    {...props}
  >
    <circle cx="10" cy="10" r="10" fill="#38A169" />
    <path
      d="M6 10.5l2.5 2.5L14 8.5"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MotionBox = motion(Box);

const TITLE_MIN = 5;
const TITLE_MAX = 35;
const DESC_MIN = 120;
const DESC_MAX = 500;

interface FormValues {
  name: string;
  description: string;
  itemType: string;
  howToDetails: string;
  extraDetails: string;
  startDate: string;
  endDate: string;
  siteIds: number[];
  customerId?: number;
  itemOwnerUserId?: number | null;
  fullAddress?: string;
  lat?: number;
  lng?: number;
  itemPhysicality?: string;
  infoContent?: string;
}

export function AddItemModalSplitPane({
  isOpen,
  onClose,
  categoryId,
  catOwnerUserId,
  onCreated,
  item,
}: AddItemModalProps) {
  /* ---------- 2. user hook matches the original component ---------- */
  const { user } = useUser();
  const customerId = user?.customerId;
  const toast = useToast();
  const theme = useTheme();

  /* ------------------  React-Hook-Form boilerplate ----------------- */
  const methods = useForm<FormValues>({
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      itemType: "singleDayBookable",
      howToDetails: "",
      extraDetails: "",
      startDate: "",
      endDate: "",
      siteIds: [] as number[],
      customerId: customerId ?? undefined,
      itemOwnerUserId: null,
      fullAddress: "",
      lat: undefined,
      lng: undefined,
      itemPhysicality: undefined,
      infoContent: "",
    },
  });
  const {
    handleSubmit,
    trigger,
    setValue,
    control,
    reset,
    watch,
    formState: { errors },
  } = methods;

  /* ---------- 3. identical state to the legacy modal --------------- */
  const [currentSection, setCurrentSection] = useState("basic");
  const [sites, setSites] = useState<Site[]>([]);
  const [loadingSites, setLoadingSites] = useState(false);
  const [siteIdsState, setSiteIdsState] = useState<number[]>([]);
  const [ownerOption, setOwnerOption] = useState<
    "category" | "item" | undefined
  >(undefined);
  const [teamMembers, setTeamMembers] = useState<BigUpTeamMember[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [additionalFiles, setAdditionalFiles] = useState<File[]>([]);
  const [existingLogoUrl, setExistingLogoUrl] = useState<string | null>(null);
  const [existingCoverUrl, setExistingCoverUrl] = useState<string | null>(null);
  const [removeLogoUrl, setRemoveLogoUrl] = useState<string | null>(null);
  const [removeCoverUrl, setRemoveCoverUrl] = useState<string | null>(null);
  const borderColor = transparentize(theme.colors.primaryTextColor, 0.1)(theme);
  const [previewOpen, setPreviewOpen] = useState(false);

  /* ---------------- 4. fetch sites & team-members  ----------------- */
  useEffect(() => {
    if (!isOpen) return;
    setLoadingSites(true);
    (async () => {
      try {
        const res = await fetch("/api/site/allBy?selectColumns=id,siteName");
        const data = await res.json();
        setSites(data.resource ?? []);
      } catch {
        setSites([]);
      } finally {
        setLoadingSites(false);
      }
    })();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !customerId) return;
    (async () => {
      try {
        const res = await fetch(
          `/api/getForTeamMemberInput?customerId=${customerId}`
        );
        const data = await res.json();
        setTeamMembers(data.resource ?? data);
      } catch {
        setTeamMembers([]);
      }
    })();
  }, [isOpen, customerId]);

  /* -------------- 5. keep siteIds in react-hook-form --------------- */
  useEffect(() => {
    setValue("siteIds", siteIdsState);
  }, [siteIdsState, setValue]);

  /* -------------- 6. populate fields when editing ------------------ */
  useEffect(() => {
    if (!isOpen) return;

    if (item) {
      setValue("name", item.name);
      setValue("description", item.description);
      setValue("howToDetails", item.howToDetails || "");
      setValue("itemType", item.itemType);
      setValue("extraDetails", item.extraDetails || "");
      setValue("startDate", item.startDate?.slice(0, 10) || "");
      setValue("endDate", item.endDate?.slice(0, 10) || "");
      setValue("fullAddress", item.fullAddress || "");
      setValue("lat", !isNaN(Number(item.latitude)) ? Number(item.latitude) : undefined);
      setValue("lng", !isNaN(Number(item.longitude)) ? Number(item.longitude) : undefined);
      setValue("infoContent", item.infoContent || "");

      // Set itemPhysicality based on presence of location
      const lat = Number(item.latitude);
      const lng = Number(item.longitude);
      const hasPhysicalLocation =
        !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;

      setValue(
        "itemPhysicality",
        hasPhysicalLocation ? "physical" : "non-physical"
      );

      const hasItemOwner =
        item.itemOwnerUserId &&
        String(item.itemOwnerUserId) !== "0" &&
        item.itemOwnerUserId !== "";
      if (hasItemOwner) {
        setOwnerOption("item");
        setValue("itemOwnerUserId", Number(item.itemOwnerUserId));
      } else {
        setOwnerOption("category");
        setValue("itemOwnerUserId", null);
      }

      setExistingLogoUrl(item.logoImageUrl || null);
      setExistingCoverUrl(item.coverImageUrl || null);
      setSiteIdsState((item.siteIds as any[])?.map(Number) ?? []);
    } else {
      reset(); // will restore defaultValues
      setSiteIdsState([]);
      setOwnerOption(undefined);
      setExistingLogoUrl(null);
      setExistingCoverUrl(null);
      setValue("itemPhysicality", undefined);
    }

    setLogoFile(null);
    setCoverFile(null);
    setAdditionalFiles([]);
    setRemoveLogoUrl(null);
    setRemoveCoverUrl(null);
  }, [item, isOpen, reset, setValue]);

  /* -------------- 7. section-completion tracker -------------------- */
  const watched = watch();
  const nameProvided =
    typeof watched.name === "string" && watched.name.trim().length > 0;
  const descProvided =
    typeof watched.description === "string" &&
    watched.description.trim().length > 0;
  const titleValid =
    !nameProvided ||
    (watched.name.trim().length >= TITLE_MIN &&
      watched.name.trim().length <= TITLE_MAX);
  const descriptionValid =
    !descProvided ||
    (watched.description.trim().length >= DESC_MIN &&
      watched.description.trim().length <= DESC_MAX);
  const sectionComplete = {
    basic: nameProvided && descProvided && titleValid && descriptionValid,
    location:
      watched.itemPhysicality === "non-physical" ||
      (watched.itemPhysicality === "physical" &&
        !!watched.fullAddress &&
        !!watched.lat &&
        !!watched.lng),
    owner: ownerOption === "category" || !!watched.itemOwnerUserId,
    images:
      !!(logoFile || existingLogoUrl) && !!(coverFile || existingCoverUrl),
  };

  /* ---------------------- 8. submit logic -------------------------- */
  const onSubmit = async (data: any) => {
    // If non-physical, clear location fields
    if (data.itemPhysicality === "non-physical") {
      data.fullAddress = "";
      data.lat = "";
      data.lng = "";
    }

    /* identical guards to the old component */
    if (removeLogoUrl && !logoFile) {
      toast({
        title: "Logo image required",
        description:
          "Please upload a new logo image after removing the existing one.",
        status: "error",
      });
      return;
    }
    if (removeCoverUrl && !coverFile) {
      toast({
        title: "Cover image required",
        description:
          "Please upload a new cover image after removing the existing one.",
        status: "error",
      });
      return;
    }

    // Map lat/lng to latitude/longitude for backend compatibility
    if (data.lat !== undefined) data.latitude = data.lat;
    if (data.lng !== undefined) data.longitude = data.lng;

    // Log the new/updated item data
    console.log("Submitting item:", data);

    const method = item ? "PUT" : "POST";
    /* build FormData exactly as before */
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (k === "siteIds" || v === undefined || v === null || v === "") return;
      formData.append(k, String(v));
    });
    siteIdsState.forEach((id) => formData.append("siteIds[]", String(id)));
    if (customerId !== undefined)
      formData.append("customerId", String(customerId));

    /* ***owner fallback identical to original component*** */
    const ownerUserId =
      ownerOption === "category" ? catOwnerUserId : data.itemOwnerUserId;
    if (ownerUserId) formData.append("itemOwnerUserId", String(ownerUserId));

    formData.append("hospitalityCatId", categoryId);
    if (item) formData.append("id", item.id);

    if (logoFile) formData.append("logoImageUpload", logoFile);
    if (coverFile) formData.append("coverImageUpload", coverFile);
    additionalFiles.forEach((f) =>
      formData.append("AdditionalImagesListUpload[]", f)
    );

    try {
      const res = await fetch("/api/hospitality-hub/items", {
        method,
        body: formData,
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Request failed");

      toast({
        title: item
          ? "Item updated successfully."
          : "Item created successfully.",
        status: "success",
      });
      onCreated();
      onClose();
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Failed to upload images.",
        description: err.message,
        status: "error",
      });
    }
  };

  /* --------------------- 9. UI wiring (unchanged) ------------------ */
  const Sidebar = (
    <VStack align="stretch" spacing={4} h="100%" justify="space-between">
      <VStack align="stretch" spacing={2}>
        {SECTIONS.map((sec) => {
          const isActive = currentSection === sec.id;
          return (
            <Button
              key={sec.id}
              variant={isActive ? "solid" : "ghost"}
              onClick={() => setCurrentSection(sec.id)}
              justifyContent="flex-start"
              display="flex"
              border="1px solid"
              borderColor={borderColor}
              alignItems="center"
              {...(isActive && {
                _hover: {},
              })}
            >
              <Box
                w="100%"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <span
                  style={{
                    color: isActive
                      ? "white"
                      : theme.colors.primaryTextColor || undefined,
                  }}
                >
                  {sec.label}
                </span>
                {sectionComplete[sec.id as keyof typeof sectionComplete] && (
                  <Badge
                    colorScheme="green"
                    display="flex"
                    alignItems="center"
                    fontSize="0.75em"
                    borderRadius="md"
                    px={2}
                    py={1}
                  >
                    <CheckCircleIcon
                      style={{ marginRight: 4, width: 14, height: 14 }}
                    />
                    DONE
                  </Badge>
                )}
              </Box>
            </Button>
          );
        })}
      </VStack>
      <VStack spacing={0}>
        <Button
          leftIcon={<VisibilityIcon />}
          variant="outline"
          colorScheme="gray"
          w="100%"
          onClick={() => setPreviewOpen(true)}
          isDisabled={!Object.values(sectionComplete).every(Boolean)}
        >
          Preview
        </Button>
        <Button
          mt={2}
          w="100%"
          leftIcon={<CheckIcon />}
          colorScheme="primary"
          color="white"
          isDisabled={!Object.values(sectionComplete).every(Boolean)}
          onClick={handleSubmit(onSubmit)}
        >
          {item ? "Update" : "Create"}
        </Button>
      </VStack>
    </VStack>
  );

  const Panel =
    currentSection === "basic" ? (
      <SectionBasicInfo />
    ) : currentSection === "location" ? (
      <SectionLocation />
    ) : currentSection === "owner" ? (
      <SectionOwner
        ownerOption={ownerOption}
        setOwnerOption={setOwnerOption}
        teamMembers={teamMembers}
        control={control}
        setValue={setValue}
      />
    ) : (
      <SectionImages
        logoFile={logoFile}
        setLogoFile={setLogoFile}
        coverFile={coverFile}
        setCoverFile={setCoverFile}
        additionalFiles={additionalFiles}
        setAdditionalFiles={setAdditionalFiles}
        existingLogoUrl={existingLogoUrl}
        setExistingLogoUrl={setExistingLogoUrl}
        existingCoverUrl={existingCoverUrl}
        setExistingCoverUrl={setExistingCoverUrl}
        removeLogoUrl={removeLogoUrl}
        setRemoveLogoUrl={setRemoveLogoUrl}
        removeCoverUrl={removeCoverUrl}
        setRemoveCoverUrl={setRemoveCoverUrl}
      />
    );

  const mobileItems = SECTIONS.map((s) => {
    const complete = sectionComplete[s.id as keyof typeof sectionComplete];
    return {
      id: s.id,
      label: s.label,
      content: (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          w="100%"
        >
          <span>{s.label}</span>
          {complete && (
            <Badge
              colorScheme="green"
              display="flex"
              alignItems="center"
              fontSize="0.75em"
              borderRadius="md"
              px={2}
              py={1}
            >
              <CheckCircleIcon
                style={{ marginRight: 4, width: 14, height: 14 }}
              />
              DONE
            </Badge>
          )}
        </Box>
      ),
    };
  });

  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <FormProvider {...methods}>
      <SplitPaneModal
        isOpen={isOpen}
        onClose={onClose}
        icon={
          <BusinessOutlined
            fontSize="inherit"
            htmlColor="var(--chakra-colors-primary)"
          />
        }
        title={item ? "Update Item" : "Create Item"}
        sidebar={Sidebar}
        panel={<Box>{Panel}</Box>}
        mobileItems={mobileItems}
        mobileSelectedId={currentSection}
        onMobileSelect={(id) => setCurrentSection(id as string)}
        footer={
          isMobile && (
            <VStack spacing={2} w="100%">
              <Button
                leftIcon={<VisibilityIcon />}
                variant="outline"
                colorScheme="gray"
                onClick={() => setPreviewOpen(true)}
                isDisabled={!Object.values(sectionComplete).every(Boolean)}
                width="100%"
              >
                Preview
              </Button>
              <Button
                width="100%"
                leftIcon={<CheckIcon />}
                colorScheme="primary"
                color="white"
                isDisabled={!Object.values(sectionComplete).every(Boolean)}
                onClick={handleSubmit(onSubmit)}
              >
                {item ? "Update" : "Create"}
              </Button>
            </VStack>
          )
        }
      />
      <ItemDetailModal
        isOpen={previewOpen}
        isPreview={true}
        onClose={() => setPreviewOpen(false)}
        item={
          {
            ...(() => {
              const { customerId, itemOwnerUserId, ...rest } =
                methods.getValues();
              return rest;
            })(),
            logoImageUrl: logoFile
              ? URL.createObjectURL(logoFile)
              : existingLogoUrl === null
                ? ""
                : existingLogoUrl,
            coverImageUrl: coverFile
              ? URL.createObjectURL(coverFile)
              : existingCoverUrl === null
                ? ""
                : existingCoverUrl,
            latitude: methods.getValues().lat,
            longitude: methods.getValues().lng,
            id: item?.id ?? "preview",
            hospitalityCatId: categoryId,
            isActive: item?.isActive ?? true,
            customerId:
              methods.getValues().customerId !== undefined
                ? String(methods.getValues().customerId)
                : "",
            itemOwnerUserId:
              methods.getValues().itemOwnerUserId !== undefined &&
              methods.getValues().itemOwnerUserId !== null
                ? String(methods.getValues().itemOwnerUserId)
                : "",
          } as HospitalityItem
        }
        loading={false}
        siteNames={sites
          .filter((site) => methods.getValues().siteIds?.includes(site.id))
          .map((site) => site.siteName)}
      />
    </FormProvider>
  );
}
