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
import { useState } from "react";
import BookingModal from "./BookingModal";
import {
  Description,
  HowToReg,
  Info,
  CalendarToday,
  EventAvailable,
  LocationOn,
  Category,
} from "@mui/icons-material";

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
const MotionBox = motion(Box);
const MotionHStack = motion(HStack);

export const ItemDetailModal = ({
  isOpen,
  onClose,
  item,
  loading,
  optionalFields,
}: ItemDetailModalProps) => {
  const [bookingOpen, setBookingOpen] = useState(false);

  const ctaText =
    item?.itemType === "singleDayBookable"
      ? "Book Now"
      : item?.itemType === "singleDayBookableWithStartEnd"
        ? "Book Slot"
        : item?.itemType === "multiDayBookable"
          ? "Book Event"
          : "";

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
                >
                  <ModalHeader
                    fontSize="3xl"
                    textAlign="left"
                    color="yellow.400"
                    fontFamily="metropolis"
                    p={0}
                  >
                    {item?.name || "Details"}
                  </ModalHeader>
                  <VStack align="start" spacing={6} width="100%">
                    {item?.description && (
                      <MotionHStack
                        variants={itemVariants}
                        width="100%"
                        alignItems="flex-start"
                      >
                        <Description />
                        <Text flex="1">{item.description}</Text>
                      </MotionHStack>
                    )}
                    {item?.howToDetails && (
                      <MotionHStack
                        variants={itemVariants}
                        width="100%"
                        alignItems="flex-start"
                      >
                        <HowToReg />
                        <Text flex="1">{item.howToDetails}</Text>
                      </MotionHStack>
                    )}
                    {item?.extraDetails && (
                      <MotionHStack
                        variants={itemVariants}
                        width="100%"
                        alignItems="flex-start"
                      >
                        <Info />
                        <Text flex="1">{item.extraDetails}</Text>
                      </MotionHStack>
                    )}
                    {item?.startDate && (
                      <MotionHStack
                        variants={itemVariants}
                        width="100%"
                        alignItems="flex-start"
                      >
                        <CalendarToday />
                        <Text flex="1">{item.startDate}</Text>
                      </MotionHStack>
                    )}
                    {item?.endDate && (
                      <MotionHStack
                        variants={itemVariants}
                        width="100%"
                        alignItems="flex-start"
                      >
                        <EventAvailable />
                        <Text flex="1">{item.endDate}</Text>
                      </MotionHStack>
                    )}
                    {item?.location && (
                      <MotionHStack
                        variants={itemVariants}
                        width="100%"
                        alignItems="flex-start"
                      >
                        <LocationOn />
                        <Text flex="1">{item.location}</Text>
                      </MotionHStack>
                    )}

                    {optionalFields?.map((field) =>
                      item && (item as any)[field] ? (
                        <MotionHStack
                          key={field}
                          variants={itemVariants}
                          width="100%"
                          alignItems="flex-start"
                        >
                          <Info />
                          <Text flex="1">{String((item as any)[field])}</Text>
                        </MotionHStack>
                      ) : null
                    )}
                  </VStack>
                </MotionVStack>
                {item?.coverImageUrl && (
                  <Box position="relative">
                    <MotionImage
                      src={item.coverImageUrl}
                      alt={item.name}
                      variants={itemVariants}
                      objectFit="cover"
                      borderRadius="md"
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
                )}
              </SimpleGrid>
            )}
          </ModalBody>
          {item && ctaText && (
            <Box p={4} textAlign="center">
              <Button colorScheme="yellow" onClick={() => setBookingOpen(true)}>
                {ctaText}
              </Button>
            </Box>
          )}
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
