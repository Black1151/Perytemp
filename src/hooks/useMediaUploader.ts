import { ChangeEvent, useState, useCallback } from "react";
import { useToast } from "@chakra-ui/react";

interface UseMediaUploaderReturn {
  isUploading: boolean;
  handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  uploadMediaFile: (file: File) => Promise<any>;
}

// Helper: basic extension extraction
const getExtension = (filename: string) =>
  filename.includes(".") ? filename.split(".").pop()!.toLowerCase() : "";

export const useMediaUploader = (
  endpoint: string,
  formKey: string,
  onSuccess: () => void,
  maxFileSize = 2 * 1024 * 1024,
  allowedFileTypes: string[] = ["image/*"]
): UseMediaUploaderReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const toast = useToast();

  // ——— Validation ———
  const validateFile = (file: File): boolean => {
    const type = (file.type || "").toLowerCase();

    const mimeOk =
      allowedFileTypes.some((t) =>
        t === "image/*" ? type.startsWith("image/") : t.toLowerCase() === type
      ) ||
      (() => {
        const ext = getExtension(file.name);
        const allowedExts = ["jpg", "jpeg", "png", "heic", "heif", "webp"];
        return ext && allowedExts.includes(ext);
      })();

    if (!mimeOk) {
      toast({
        title: "Unsupported format",
        description:
          "Please choose an image file (JPEG, PNG, HEIC, HEIF, WebP…).",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
      return false;
    }

    if (file.size > maxFileSize) {
      toast({
        title: "File too large",
        description: `File size must be less than ${(maxFileSize / 1024 / 1024).toFixed(2)} MB.`,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
      return false;
    }

    return true;
  };

  // ——— Upload logic ———
  const uploadMedia = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append(formKey, file);

    try {
      const resp = await fetch(endpoint, { method: "POST", body: formData });
      if (!resp.ok) throw new Error("Failed to upload file");

      await resp.json();
      toast({
        title: "Upload successful",
        description: "Your file has been uploaded.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
      onSuccess();
    } catch (err) {
      console.error("File upload error:", err);
      toast({
        title: "Upload failed",
        description:
          "There was an error uploading your file. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // ——— Public API ———
  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = ""; // reset regardless
    if (file && validateFile(file)) await uploadMedia(file);
  };

  const uploadMediaFile = useCallback(
    async (file: File) => {
      if (!validateFile(file)) throw new Error("Validation failed");
      return uploadMedia(file);
    },
    [validateFile]
  );

  return { isUploading, handleFileChange, uploadMediaFile };
};
