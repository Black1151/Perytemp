"use client";

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
  Textarea
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
  onAdd: (item: any) => void;
}

const fieldsMap: Record<string, { name: string; label: string; type: string }[]> = {
  Hotels: [
    { name: "name", label: "Name", type: "text" },
    { name: "location", label: "Location", type: "text" },
    { name: "rating", label: "Rating", type: "number" },
    { name: "description", label: "Description", type: "textarea" },
    { name: "image", label: "Image Url", type: "text" }
  ],
  Rewards: [
    { name: "name", label: "Name", type: "text" },
    { name: "points", label: "Points", type: "number" },
    { name: "description", label: "Description", type: "textarea" },
    { name: "expiryDate", label: "Expiry Date", type: "date" },
    { name: "image", label: "Image Url", type: "text" }
  ],
  Events: [
    { name: "name", label: "Name", type: "text" },
    { name: "date", label: "Date", type: "date" },
    { name: "location", label: "Location", type: "text" },
    { name: "description", label: "Description", type: "textarea" },
    { name: "image", label: "Image Url", type: "text" }
  ],
  Medical: [
    { name: "provider", label: "Provider", type: "text" },
    { name: "speciality", label: "Speciality", type: "text" },
    { name: "location", label: "Location", type: "text" },
    { name: "contact", label: "Contact", type: "text" },
    { name: "image", label: "Image Url", type: "text" }
  ],
  Legal: [
    { name: "provider", label: "Provider", type: "text" },
    { name: "speciality", label: "Speciality", type: "text" },
    { name: "location", label: "Location", type: "text" },
    { name: "contact", label: "Contact", type: "text" },
    { name: "image", label: "Image Url", type: "text" }
  ]
};

export default function AddItemModal({ isOpen, onClose, category, onAdd }: AddItemModalProps) {
  const { register, handleSubmit, reset } = useForm();

  const fields = fieldsMap[category] || [];

  const onSubmit = async (data: any) => {
    try {
      await fetch(`/api/hospitality-hub/${category.toLowerCase()}`, {
        method: "POST",
        body: JSON.stringify(data)
      });
      onAdd(data);
      reset();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add {category.slice(0, -1)}</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            {fields.map(field => (
              <FormControl key={field.name} mb={4}>
                <FormLabel>{field.label}</FormLabel>
                {field.type === "textarea" ? (
                  <Textarea {...register(field.name)} placeholder={field.label} />
                ) : (
                  <Input type={field.type} {...register(field.name)} placeholder={field.label} />
                )}
              </FormControl>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="pink" mr={3} type="submit">
              Save
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
