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

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryId: string;
  onCreated: () => void;
}

interface FormValues {
  title: string;
  description: string;
}

export default function AddItemModal({
  isOpen,
  onClose,
  categoryId,
  onCreated,
}: AddItemModalProps) {
  const { register, handleSubmit, reset } = useForm<FormValues>();

  const { user } = useUser();

  const customerId = user?.customerId;
  const userId = user?.userId;

  const onSubmit = async (data: FormValues) => {
    await fetch("/api/hospitality-hub/items", {
      method: "POST",
      body: JSON.stringify({
        ...data,
        customerId,
        userId,
        categoryId,
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
        <ModalHeader>Create Item</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <FormControl mb={4} isRequired>
              <FormLabel>Title</FormLabel>
              <Input {...register("title", { required: true })} />
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
