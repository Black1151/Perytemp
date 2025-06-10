"use client";

import React, { useState, useRef, useCallback } from "react";
import {
  Box,
  Flex,
  VStack,
  Spinner,
  Image,
  Text,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { useMediaUploader } from "@/hooks/useMediaUploader";

interface DragDropFileUploadProps {
  uploadEndpoint: string;
  formKey: string;
  onUploadComplete?: (url: string) => void;
  placeholder?: string;
  initialUrl?: string;
  multiple?: boolean;
}

export default function DragDropFileUpload({
  uploadEndpoint,
  formKey,
  onUploadComplete,
  placeholder = "Drag & drop file here",
  initialUrl = "",
  multiple = false,
}: DragDropFileUploadProps) {
  const { isUploading, uploadMediaFile } = useMediaUploader(
    uploadEndpoint,
    formKey,
    () => {}
  );

  const [previewUrl, setPreviewUrl] = useState(initialUrl);
  const inputRef = useRef<HTMLInputElement>(null);
  const borderColor = useColorModeValue("gray.400", "gray.600");
  const hoverBorderColor = useColorModeValue("gray.200", "gray.400");

  const extractUrl = (data: any): string =>
    data.imageUrl || data.url || data.resource?.imageUrl || "";

  const handleUploadSuccess = (url: string) => {
    if (!multiple) setPreviewUrl(url);
    onUploadComplete?.(url);
  };

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = multiple ? Array.from(files) : [files[0]];
    for (const file of fileArray) {
      if (!file) continue;
      if (!multiple) {
        const localUrl = URL.createObjectURL(file);
        setPreviewUrl(localUrl);
      }
      try {
        const data = await uploadMediaFile(file);
        const newUrl = extractUrl(data);
        handleUploadSuccess(newUrl);
      } catch {
        // error toast already shown by hook
      }
    }
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const onDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      const files = e.dataTransfer.files;
      if (!files || files.length === 0) return;
      await handleFiles(files);
    },
    [handleFiles]
  );

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    await handleFiles(files);
    e.target.value = "";
  };

  return (
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
        {isUploading && (
          <Flex
            position="absolute"
            inset={0}
            bg="rgba(255,255,255,0.8)"
            align="center"
            justify="center"
            borderRadius="md"
            zIndex={2}
          >
            <Spinner size="lg" />
          </Flex>
        )}

        <Box mb={4}>
          {previewUrl ? (
            <Image src={previewUrl} alt="preview" maxH="100px" mx="auto" />
          ) : (
            <Text color="white" fontSize={18}>
              {placeholder}
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
          disabled={isUploading}
        >
          {previewUrl ? "Change File" : "Browse files"}
        </Button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          style={{ display: "none" }}
          onChange={onFileChange}
          disabled={isUploading}
        />
      </Box>
    </VStack>
  );
}
