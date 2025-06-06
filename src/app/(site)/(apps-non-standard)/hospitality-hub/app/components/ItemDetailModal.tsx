"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  Spinner,
  VStack,
} from "@chakra-ui/react";
import { HospitalityItem } from "@/types/hospitalityHub";

interface ItemDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: HospitalityItem | null;
  loading?: boolean;
  optionalFields?: string[];
}

export const ItemDetailModal = ({
  isOpen,
  onClose,
  item,
  loading,
  optionalFields,
}: ItemDetailModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent p={4}>
        <ModalHeader>{item?.name || item?.title || "Details"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {loading ? (
            <Spinner />
          ) : (
            <VStack align="start" spacing={2}>
              {item?.description && <Text>{item.description}</Text>}
              {optionalFields?.map((field) =>
                item && item[field] ? (
                  <Text key={field}>
                    {field.charAt(0).toUpperCase() + field.slice(1)}:{" "}
                    {String(item[field])}
                  </Text>
                ) : null
              )}
            </VStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ItemDetailModal;
