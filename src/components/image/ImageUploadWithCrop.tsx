import { useState } from "react";
import { FormControl, FormLabel, Input, Image } from "@chakra-ui/react";
import ImageCropper from "./ImageCropper";

interface Props {
  label: string;
  onFileSelected: (file: File | null) => void;
  isRequired?: boolean;
}

export default function ImageUploadWithCrop({
  label,
  onFileSelected,
  isRequired = false,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [cropOpen, setCropOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setCropOpen(true);
    }
    e.target.value = "";
  };

  const handleComplete = (cropped: File) => {
    setCropOpen(false);
    setFile(null);
    setPreviewUrl(URL.createObjectURL(cropped));
    onFileSelected(cropped);
  };

  const handleCancel = () => {
    setCropOpen(false);
    setFile(null);
  };

  return (
    <FormControl mb={4} isRequired={isRequired}>
      <FormLabel>{label}</FormLabel>
      <Input type="file" accept="image/*" onChange={handleChange} />
      {previewUrl && (
        <Image src={previewUrl} alt="preview" maxH="100px" mt={2} />
      )}
      <ImageCropper
        file={file}
        isOpen={cropOpen}
        onCancel={handleCancel}
        onComplete={handleComplete}
      />
    </FormControl>
  );
}
