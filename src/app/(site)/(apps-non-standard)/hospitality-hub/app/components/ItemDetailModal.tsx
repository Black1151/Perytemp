"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Text,
  Spinner,
  VStack,
  Image,
  SimpleGrid,
  Box,
  Button,
  HStack,
} from "@chakra-ui/react";
import { motion, Variants } from "framer-motion";
import { HospitalityItem } from "@/types/hospitalityHub";
import { useEffect, useState } from "react";
import BookingModal from "./BookingModal";

interface ItemDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: HospitalityItem | null;
  loading?: boolean;
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

const MotionImage = motion(Image);

const MotionHStack = motion(HStack);

export const ItemDetailModal = ({
  isOpen,
  onClose,
  item,
  loading,
}: ItemDetailModalProps) => {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    setImageIndex(0);
  }, [item]);

  const ctaText =
    item?.itemType === "info"
      ? ""
      : item?.itemType === "singleDayBookable"
        ? "Book Now"
        : item?.itemType === "singleDayBookableWithStartEnd"
          ? "Book Slot"
          : item?.itemType === "multiDayBookable"
            ? "Book Event"
            : "";

  const additionalImages = Array.isArray(item?.additionalImageUrlList)
    ? item?.additionalImageUrlList
    : typeof item?.additionalImageUrlList === "string"
      ? item.additionalImageUrlList
          .split(",")
          .map((u) => u.trim())
          .filter(Boolean)
      : [];
  const images = [item?.coverImageUrl, ...additionalImages].filter(
    Boolean,
  ) as string[];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay />
      <ModalContent
        bg="gray.800"
        color="gray.200"
        p={0}
        border="2px solid yellow"
        borderRadius="lg"
      >
        <VStack
          bg="rgba(0,0,0,0.6)"
          align="stretch"
          spacing={0}
          borderRadius="lg"
        >
          <ModalBody p={0}>
            {loading ? (
              <Spinner />
            ) : (
              <SimpleGrid columns={2} spacing={4}>
                <MotionVStack
                  align="start"
                  spacing={2}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  p={4}
                  h="100%"
                  justify="space-between"
                >
                  <ModalHeader
                    fontSize="3xl"
                    textAlign="left"
                    color="hospitalityHubPremium"
                    fontFamily="metropolis"
                    p={0}
                  >
                    {item?.name || "Details"}
                  </ModalHeader>
                  <VStack
                    align="start"
                    spacing={6}
                    width="100%"
                    flex={1}
                    justify="space-evenly"
                  >
                    {item?.description && (
                      <MotionHStack
                        variants={itemVariants}
                        width="100%"
                        alignItems="flex-start"
                      >
                        <Text color="hospitalityHubPremium" minW="120px">
                          Description:
                        </Text>
                        <Text flex="1">{item.description}</Text>
                      </MotionHStack>
                    )}
                    {item?.howToDetails && (
                      <MotionHStack
                        variants={itemVariants}
                        width="100%"
                        alignItems="flex-start"
                      >
                        <Text color="hospitalityHubPremium" minW="120px">
                          How To:
                        </Text>
                        <Text flex="1">{item.howToDetails}</Text>
                      </MotionHStack>
                    )}
                    {item?.extraDetails && (
                      <MotionHStack
                        variants={itemVariants}
                        width="100%"
                        alignItems="flex-start"
                      >
                        <Text color="hospitalityHubPremium" minW="120px">
                          Info:
                        </Text>
                        <Text flex="1">{item.extraDetails}</Text>
                      </MotionHStack>
                    )}
                    {item?.startDate && (
                      <MotionHStack
                        variants={itemVariants}
                        width="100%"
                        alignItems="flex-start"
                      >
                        <Text color="hospitalityHubPremium" minW="120px">
                          Start:
                        </Text>
                        <Text flex="1">{item.startDate}</Text>
                      </MotionHStack>
                    )}
                    {item?.endDate && (
                      <MotionHStack
                        variants={itemVariants}
                        width="100%"
                        alignItems="flex-start"
                      >
                        <Text color="hospitalityHubPremium" minW="120px">
                          End:
                        </Text>
                        <Text flex="1">{item.endDate}</Text>
                      </MotionHStack>
                    )}
                    {item?.location && (
                      <MotionHStack
                        variants={itemVariants}
                        width="100%"
                        alignItems="flex-start"
                      >
                        <Text color="hospitalityHubPremium" minW="120px">
                          Location:
                        </Text>
                        <Text flex="1">{item.location}</Text>
                      </MotionHStack>
                    )}
                    {item && ctaText && (
                      <Box p={4} textAlign="center" w="100%">
                        <Button
                          variant="hospitalityHub"
                          onClick={() => setBookingOpen(true)}
                        >
                          {ctaText}
                        </Button>
                      </Box>
                    )}
                  </VStack>
                </MotionVStack>
                {images.length > 0 && (
                  <VStack spacing={2} align="stretch">
                    <Box position="relative" h="100%">
                      <MotionImage
                        src={images[imageIndex]}
                        alt={item?.name}
                        variants={itemVariants}
                        objectFit="cover"
                        borderRadius="md"
                        w="100%"
                        h="100%"
                      />
                      <Box
                        position="absolute"
                        top={0}
                        left={0}
                        right={0}
                        bottom={0}
                        bgGradient="linear(90deg, rgba(0,0,0,0.95), transparent)"
                        borderRadius="md"
                      />
                    </Box>
                    {images.length > 1 && (
                      <HStack justify="center" spacing={2}>
                        {images.map((img, idx) => (
                          <Image
                            key={idx}
                            src={img}
                            alt={`${item?.name}-${idx}`}
                            boxSize="60px"
                            objectFit="cover"
                            borderRadius="md"
                            border={
                              idx === imageIndex ? "2px solid yellow" : "none"
                            }
                            cursor="pointer"
                            onClick={() => setImageIndex(idx)}
                          />
                        ))}
                      </HStack>
                    )}
                  </VStack>
                )}
              </SimpleGrid>
            )}
          </ModalBody>
        </VStack>
        {item && (
          <BookingModal
            item={item}
            isOpen={bookingOpen}
            onClose={() => setBookingOpen(false)}
          />
        )}
      </ModalContent>
    </Modal>
  );
};

export default ItemDetailModal;
