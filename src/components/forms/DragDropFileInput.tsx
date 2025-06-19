"use client";

import React, { useState, useRef, useCallback } from "react";
import {
  Box,
  VStack,
  HStack,
  Image,
  Text,
  Button,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import CloseIcon from "@mui/icons-material/Close";

interface DragDropFileInputProps {
  onFilesSelected: (files: File[]) => void;
  placeholder?: string;
  multiple?: boolean;
}

export default function DragDropFileInput({
  onFilesSelected,
  placeholder = "Drag & drop files here",
  multiple = false,
}: DragDropFileInputProps) {
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const borderColor = useColorModeValue("gray.400", "gray.600");
  const hoverBorderColor = useColorModeValue("gray.200", "gray.400");

  const handleFiles = (files: FileList | File[]) => {
    const arr = Array.from(files);
    if (multiple) {
      setSelectedFiles((prev) => {
        const newFiles = [...prev, ...arr];
        onFilesSelected(newFiles);
        return newFiles;
      });
      setPreviewUrls((prev) => [
        ...prev,
        ...arr.map((f) => URL.createObjectURL(f)),
      ]);
    } else if (arr[0]) {
      setPreviewUrl(URL.createObjectURL(arr[0]));
      setSelectedFiles([arr[0]]);
      onFilesSelected([arr[0]]);
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

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
    e.target.value = "";
  };

  const handleRemove = (e: React.MouseEvent, index?: number) => {
    e.stopPropagation();
    if (multiple) {
      setSelectedFiles((prev) => {
        const newFiles =
          index === undefined ? [] : prev.filter((_, i) => i !== index);
        onFilesSelected(newFiles);
        return newFiles;
      });
      setPreviewUrls((prev) => {
        if (index === undefined) {
          prev.forEach((url) => URL.revokeObjectURL(url));
          return [];
        }
        URL.revokeObjectURL(prev[index]);
        return prev.filter((_, i) => i !== index);
      });
    } else {
      setPreviewUrl("");
      setSelectedFiles([]);
      onFilesSelected([]);
    }
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
        {(previewUrl || selectedFiles.length > 0) && (
          <IconButton
            aria-label="Remove"
            icon={<CloseIcon />}
            size="sm"
            color="red.500"
            variant="ghost"
            position="absolute"
            top={2}
            right={2}
            onClick={(e) => handleRemove(e)}
          />
        )}
        <Box mb={4}>
          {previewUrl && !multiple ? (
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
          mt={previewUrl && !multiple ? 0 : 4}
          onClick={(e) => {
            e.stopPropagation();
            inputRef.current?.click();
          }}
        >
          {previewUrl && !multiple ? "Change File" : "Browse files"}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          style={{ display: "none" }}
          onChange={onFileChange}
        />
      </Box>
      {multiple && previewUrls.length > 0 && (
        <HStack flexWrap="wrap" spacing={2} w="100%">
          {previewUrls.map((url, idx) => (
            <Box key={idx} position="relative">
              <IconButton
                aria-label="Remove"
                icon={<CloseIcon />}
                size="xs"
                color="red.500"
                variant="ghost"
                position="absolute"
                top={1}
                right={1}
                onClick={(e) => handleRemove(e, idx)}
              />
              <Image src={url} alt={`preview-${idx}`} maxH="100px" />
            </Box>
          ))}
        </HStack>
      )}
    </VStack>
  );
}
