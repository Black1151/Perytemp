"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  FormControl,
  FormLabel,
  VStack,
  Box,
  Button,
  Text,
  Image,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import CloseIcon from "@mui/icons-material/Close";
import ImageCropper from "./ImageCropper";

interface Props {
  label: string;
  onFileSelected: (file: File | null) => void;
  isRequired?: boolean;
  /** Existing image URL to display when editing */
  existingUrl?: string;
  /** Called when an existing image is removed */
  onRemoveExisting?: () => void;
}

export default function ImageUploadWithCrop({
  label,
  onFileSelected,
  isRequired = false,
  existingUrl,
  onRemoveExisting,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [cropOpen, setCropOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [usingExisting, setUsingExisting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const borderColor = useColorModeValue("gray.400", "gray.600");
  const hoverBorderColor = useColorModeValue("gray.200", "gray.400");

  const handleFiles = (files: FileList | File[]) => {
    const f = files[0];
    if (f) {
      setFile(f);
      setCropOpen(true);
    }
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
    e.target.value = "";
  };

  const handleComplete = (cropped: File) => {
    setCropOpen(false);
    setFile(null);
    setPreviewUrl(URL.createObjectURL(cropped));
    setUsingExisting(false);
    onFileSelected(cropped);
  };

  const handleCancel = () => {
    setCropOpen(false);
    setFile(null);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (usingExisting && onRemoveExisting) {
      onRemoveExisting();
    }
    setPreviewUrl("");
    setUsingExisting(false);
    setFile(null);
    onFileSelected(null);
  };

  useEffect(() => {
    if (existingUrl) {
      setPreviewUrl(existingUrl);
      setUsingExisting(true);
    } else {
      setPreviewUrl("");
      setUsingExisting(false);
    }
  }, [existingUrl]);

  return (
    <FormControl mb={4} isRequired={isRequired}>
      <FormLabel>{label}</FormLabel>
      <VStack w="100%" align="center" spacing={4}>
        <Box
          w="100%"
          maxW="400px"
          p={6}
          border="2px dashed"
          background="rgba(255, 255, 255, 0.1)"
          borderColor={borderColor}
          borderRadius="md"
          textAlign="center"
          position="relative"
          cursor="pointer"
          _hover={{ borderColor: hoverBorderColor }}
          onClick={() => inputRef.current?.click()}
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          {previewUrl && (
            <IconButton
              aria-label="Remove"
              icon={<CloseIcon />}
              size="sm"
              color="red.500"
              variant="ghost"
              position="absolute"
              top={2}
              right={2}
              onClick={handleRemove}
            />
          )}
          <Box mb={4}>
            {previewUrl ? (
              <Image src={previewUrl} alt="preview" maxH="100px" mx="auto" />
            ) : (
              <Text color="white" fontSize={18}>
                Drag & drop image here
              </Text>
            )}
          </Box>
          <Button
            size="sm"
            colorScheme="blue"
            mt={previewUrl ? 0 : 4}
            onClick={(e) => {
              e.stopPropagation();
              inputRef.current?.click();
            }}
          >
            {previewUrl ? "Change Image" : "Browse files"}
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleChange}
          />
        </Box>
      </VStack>
      <ImageCropper
        file={file}
        isOpen={cropOpen}
        onCancel={handleCancel}
        onComplete={handleComplete}
      />
    </FormControl>
  );
}
