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
import { motion, Variants } from "framer-motion";
import { HospitalityItem } from "@/types/hospitalityHub";

interface ItemDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: HospitalityItem | null;
  loading?: boolean;
  optionalFields?: string[];
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const MotionVStack = motion(VStack);
const MotionText = motion(Text);
const MotionImage = motion(Image);

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
      <ModalContent
        position="relative"
        color="gray.200"
        p={4}
        bg={item?.coverImageUrl ? undefined : "gray.800"}
        backgroundImage={
          item?.coverImageUrl
            ? `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${item.coverImageUrl})`
            : undefined
        }
        backgroundSize="cover"
        backgroundPosition="center"
      >
        {item?.logoImageUrl && (
          <Image
            src={item.logoImageUrl}
            alt={item.name}
            position="absolute"
            top={2}
            left={2}
            boxSize="50px"
            objectFit="contain"
            borderRadius="md"
          />
        )}
        <ModalHeader
          fontSize="3xl"
          textAlign="center"
          color="yellow.400"
          fontFamily="metropolis"
        >
          {item?.name || "Details"}
        </ModalHeader>
        <ModalCloseButton color="gray.200" />
        <ModalBody>
          {loading ? (
            <Spinner />
          ) : (
            <MotionVStack
              align="start"
              spacing={2}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {item?.description && (
                <MotionText variants={itemVariants}>{item.description}</MotionText>
              )}
              {item?.howToDetails && (
                <MotionText variants={itemVariants}>How To: {item.howToDetails}</MotionText>
              )}
              {item?.extraDetails && (
                <MotionText variants={itemVariants}>Extra Details: {item.extraDetails}</MotionText>
              )}
              {item?.startDate && (
                <MotionText variants={itemVariants}>Start Date: {item.startDate}</MotionText>
              )}
              {item?.endDate && (
                <MotionText variants={itemVariants}>End Date: {item.endDate}</MotionText>
              )}
              {item?.location && (
                <MotionText variants={itemVariants}>Location: {item.location}</MotionText>
              )}
              {item?.itemType && (
                <MotionText variants={itemVariants}>Item Type: {item.itemType}</MotionText>
              )}
              {optionalFields?.map((field) =>
                item && (item as any)[field] ? (
                  <MotionText key={field} variants={itemVariants}>
                    {field.charAt(0).toUpperCase() + field.slice(1)}: {String((item as any)[field])}
                  </MotionText>
                ) : null
              )}
              {(item?.logoImageUrl || item?.coverImageUrl) && (
                <SimpleGrid columns={[1, 2]} gap={2} w="100%">
                  {item?.coverImageUrl && (
                    <MotionImage
                      variants={itemVariants}
                      src={item.coverImageUrl}
                      alt={item.name}
                      borderRadius="md"
                    />
                  )}
                  {item?.logoImageUrl && (
                    <MotionImage
                      variants={itemVariants}
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
                      <MotionImage variants={itemVariants} key={url} src={url} alt={item?.name} borderRadius="md" />
                    ))}
                  </SimpleGrid>
                ) : null;
              })()}
            </MotionVStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ItemDetailModal;
