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
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

interface FormValues {
  name: string;
  description: string;
}

export default function AddCategoryModal({
  isOpen,
  onClose,
  onCreated,
}: AddCategoryModalProps) {
  const { register, handleSubmit, reset } = useForm<FormValues>();

  const { user } = useUser();

  const customerId = user?.customerId;
  const userId = user?.userId;

  const onSubmit = async (data: FormValues) => {
    await fetch("/api/hospitality-hub/categories", {
      method: "POST",
      body: JSON.stringify({
        ...data,
        customerId,
        userId,
      }),
    });
    onCreated();
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Category</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <FormControl mb={4} isRequired>
              <FormLabel>Name</FormLabel>
              <Input {...register("name", { required: true })} />
            </FormControl>
            <FormControl mb={4} isRequired>
              <FormLabel>Description</FormLabel>
              <Input {...register("description", { required: true })} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" colorScheme="blue">
              Create
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
