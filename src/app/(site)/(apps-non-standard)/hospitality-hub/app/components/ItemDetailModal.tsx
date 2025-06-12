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
  Image,
  SimpleGrid,
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
        <ModalHeader>{item?.name || "Details"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {loading ? (
            <Spinner />
          ) : (
            <VStack align="start" spacing={2}>
              {item?.description && <Text>{item.description}</Text>}
              {item?.howToDetails && (
                <Text>How To: {item.howToDetails}</Text>
              )}
              {item?.extraDetails && (
                <Text>Extra Details: {item.extraDetails}</Text>
              )}
              {item?.startDate && (
                <Text>Start Date: {item.startDate}</Text>
              )}
              {item?.endDate && <Text>End Date: {item.endDate}</Text>}
              {item?.location && <Text>Location: {item.location}</Text>}
              {item?.itemType && <Text>Item Type: {item.itemType}</Text>}
              {optionalFields?.map((field) =>
                item && (item as any)[field] ? (
                  <Text key={field}>
                    {field.charAt(0).toUpperCase() + field.slice(1)}:{" "}
                    {String((item as any)[field])}
                  </Text>
                ) : null
              )}
              {(item?.logoImageUrl || item?.coverImageUrl) && (
                <SimpleGrid columns={[1, 2]} gap={2} w="100%">
                  {item?.coverImageUrl && (
                    <Image
                      src={item.coverImageUrl}
                      alt={item.name}
                      borderRadius="md"
                    />
                  )}
                  {item?.logoImageUrl && (
                    <Image
                      src={item.logoImageUrl}
                      alt={item.name}
                      borderRadius="md"
                    />
                  )}
                </SimpleGrid>
              )}
              {(() => {
                const additionalImages = Array.isArray(item?.additionalImageUrlList)
                  ? item?.additionalImageUrlList
                  : typeof item?.additionalImageUrlList === "string"
                    ? item.additionalImageUrlList.split(',').map((u) => u.trim()).filter(Boolean)
                    : [];
                return additionalImages.length ? (
                  <SimpleGrid columns={[1, 2]} gap={2} w="100%">
                    {additionalImages.map((url) => (
                      <Image key={url} src={url} alt={item?.name} borderRadius="md" />
                    ))}
                  </SimpleGrid>
                ) : null;
              })()}
            </VStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ItemDetailModal;
