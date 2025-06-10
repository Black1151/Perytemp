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
import { useEffect } from "react";

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryId: string;
  onCreated: () => void;
}

interface FormValues {
  name: string;
  description: string;
  customerId?: number;
  itemOwnerUserId?: number;
}

export default function AddItemModal({
  isOpen,
  onClose,
  categoryId,
  onCreated,
}: AddItemModalProps) {
  const { register, handleSubmit, reset, setValue } = useForm<FormValues>();

  const { user } = useUser();

  const customerId = user?.customerId;
  const userId = user?.userId;

  useEffect(() => {
    if (customerId !== undefined) setValue("customerId", customerId);
    if (userId !== undefined) setValue("itemOwnerUserId", userId);
  }, [customerId, userId, setValue]);

  const onSubmit = async (data: FormValues) => {
    await fetch("/api/hospitality-hub/items", {
      method: "POST",
      body: JSON.stringify({
        ...data,
        customerId,
        itemOwnerUserId: userId,
        hospitalityCatId: categoryId,
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
            <input type="hidden" {...register("customerId")} />
            <input type="hidden" {...register("itemOwnerUserId")} />
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
