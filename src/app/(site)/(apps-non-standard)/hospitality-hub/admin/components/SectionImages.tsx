import { VStack, FormControl, FormLabel, Box, useTheme } from "@chakra-ui/react";
import ImageUploadWithCrop from "@/components/image/ImageUploadWithCrop";
import DragDropFileInput from "@/components/forms/DragDropFileInput";
import React from "react";
import { transparentize } from "@chakra-ui/theme-tools";

type SectionImagesProps = {
  logoFile: File | null;
  setLogoFile: (f: File | null) => void;
  coverFile: File | null;
  setCoverFile: (f: File | null) => void;
  additionalFiles: File[];
  setAdditionalFiles: (f: File[]) => void;
  existingLogoUrl: string | null;
  setExistingLogoUrl: (url: string | null) => void;
  existingCoverUrl: string | null;
  setExistingCoverUrl: (url: string | null) => void;
  removeLogoUrl: string | null;
  setRemoveLogoUrl: (url: string | null) => void;
  removeCoverUrl: string | null;
  setRemoveCoverUrl: (url: string | null) => void;
};

function SectionImages({
  logoFile,
  setLogoFile,
  coverFile,
  setCoverFile,
  additionalFiles,
  setAdditionalFiles,
  existingLogoUrl,
  setExistingLogoUrl,
  existingCoverUrl,
  setExistingCoverUrl,
  removeLogoUrl,
  setRemoveLogoUrl,
  removeCoverUrl,
  setRemoveCoverUrl,
}: SectionImagesProps) {
  const theme = useTheme();
  return (
    <Box
      p={4}
      border="1px solid"
      borderColor={transparentize(theme.colors.primaryTextColor, 0.15)(theme)}
      borderRadius="md"
      bg={theme.colors.elementBG}
    >
      <VStack align="stretch" spacing={4}>
        <Box>
          <Box as="label" fontWeight="bold" color={theme.colors.primaryTextColor} mb={1} display="block">
            Logo Image
          </Box>
          <Box color={theme.colors.secondaryTextColor} fontSize="sm" mb={2}>
            Please upload a logo image for this item. PNG format is preferred for best quality and transparency support.
          </Box>
          <ImageUploadWithCrop
            label=""
            onFileSelected={setLogoFile}
            isRequired={!existingLogoUrl}
            existingUrl={existingLogoUrl || undefined}
            onRemoveExisting={() => {
              if (existingLogoUrl) setRemoveLogoUrl(existingLogoUrl);
              setExistingLogoUrl(null);
            }}
          />
        </Box>
        <Box>
          <Box as="label" fontWeight="bold" color={theme.colors.primaryTextColor} mb={1} display="block">
            Cover Image
          </Box>
          <Box color={theme.colors.secondaryTextColor} fontSize="sm" mb={2}>
            The cover image will be displayed prominently in listings and the detail modal. This image may be shown in different dimensions and cropped in various ways, so please ensure the main content of the image is centered and makes sense in all formats.
          </Box>
          <ImageUploadWithCrop
            label=""
            onFileSelected={setCoverFile}
            isRequired={!existingCoverUrl}
            existingUrl={existingCoverUrl || undefined}
            onRemoveExisting={() => {
              if (existingCoverUrl) setRemoveCoverUrl(existingCoverUrl);
              setExistingCoverUrl(null);
            }}
          />
        </Box>
      </VStack>
    </Box>
  );
}

export default SectionImages; 