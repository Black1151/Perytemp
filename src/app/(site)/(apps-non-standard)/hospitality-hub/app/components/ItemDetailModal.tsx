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

interface ItemDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: any;
  loading?: boolean;
}

export const ItemDetailModal = ({ isOpen, onClose, item, loading }: ItemDetailModalProps) => {
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
              {item?.location && <Text>Location: {item.location}</Text>}
              {item?.date && <Text>Date: {item.date}</Text>}
              {item?.points && <Text>Points: {item.points}</Text>}
              {item?.rating && <Text>Rating: {item.rating}</Text>}
              {item?.contact && <Text>Contact: {item.contact}</Text>}
            </VStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ItemDetailModal;
