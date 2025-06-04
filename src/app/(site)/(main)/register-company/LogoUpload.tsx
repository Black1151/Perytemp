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
import { useUser } from "@/providers/UserProvider";
import { useMediaUploader } from "@/hooks/useMediaUploader";

interface LogoUploadProps {
  /** Called with the final URL once the upload completes */
  onUploadComplete?: (url: string) => void;
}

export default function LogoUpload({ onUploadComplete }: LogoUploadProps) {
  const { user } = useUser();

  // Always call hooks before any early return
  const [customerImgUrl, setCustomerImgUrl] = useState(
    () => user?.custImageUrl || ""
  );
  const customerUId = user?.customerUniqueId || "";
  const customerName = user?.customerName || "";

  const { isUploading, uploadMediaFile } = useMediaUploader(
    `/api/customer/uploadPhoto/${customerUId}`,
    "imageUrl",
    () => {}
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const borderColor = useColorModeValue("gray.400", "gray.600");
  const hoverBorderColor = useColorModeValue("gray.200", "gray.400");

  // Helper to extract the URL from API response
  const extractUrl = (data: any): string =>
    data.imageUrl || data.url || data.resource?.imageUrl || customerImgUrl;

  // Shared post-upload logic
  const handleUploadSuccess = (newUrl: string) => {
    setCustomerImgUrl(newUrl);
    onUploadComplete?.(newUrl);
  };

  // Drag & drop handlers
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const onDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      if (!user) return;
      const file = e.dataTransfer.files?.[0];
      if (!file) return;

      const localUrl = URL.createObjectURL(file);
      setCustomerImgUrl(localUrl);

      try {
        const data = await uploadMediaFile(file);
        const newUrl = extractUrl(data);
        handleUploadSuccess(newUrl);
      } catch {
        // error toast already shown by hook
      }
    },
    [uploadMediaFile, user, onUploadComplete]
  );

  // File-picker handler
  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    const file = e.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setCustomerImgUrl(localUrl);

    try {
      const data = await uploadMediaFile(file);
      const newUrl = extractUrl(data);
      handleUploadSuccess(newUrl);
    } catch {
      // error toast already shown by hook
    }

    e.target.value = "";
  };

  // Early return if no user
  if (!user) return null;

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
          {customerImgUrl ? (
            <Image
              src={customerImgUrl}
              alt={customerName}
              maxH="100px"
              mx="auto"
            />
          ) : (
            <Text color="white" fontSize={18}>
              Drag & drop your logo here
            </Text>
          )}
        </Box>

        <Button
          size="sm"
          colorScheme="blue"
          mt={customerImgUrl ? 0 : 4}
          onClick={(e) => {
            e.stopPropagation();
            inputRef.current?.click();
          }}
          disabled={isUploading}
        >
          {customerImgUrl ? "Change Logo" : "Browse files"}
        </Button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={onFileChange}
          disabled={isUploading}
        />
      </Box>
    </VStack>
  );
}