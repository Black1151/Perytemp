import React from "react";
import {
  Box,
  Button,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalCloseButton,
  Stack,
  chakra,
} from "@chakra-ui/react";
import { motion, Transition } from "framer-motion";

const MotionOverlay = chakra(motion.div);
const MotionContent = chakra(motion.div);

export interface SpringModalProps {
  isOpen: boolean;
  onClose: () => void;
  showClose: boolean;

  bgIcon?: React.ReactNode;
  frontIcon?: React.ReactNode;
  header: React.ReactNode;
  body: React.ReactNode;

  secondaryLabel?: React.ReactNode;
  onSecondaryClick?: () => void;
  isSecondaryLoading?: boolean;

  primaryLabel?: React.ReactNode;
  onPrimaryClick?: () => void;
  isPrimaryLoading?: boolean;
  primaryDisabled?: boolean;

  // Optional button icons
  primaryIcon?: React.ReactElement;
  secondaryIcon?: React.ReactElement;

  // Optional button bg and color
  primaryBg?: string;
  primaryColor?: string;
  secondaryBg?: string;
  secondaryColor?: string;

  //Totally custom footer if required
  footer?: React.ReactNode;

  modalContentProps?: React.ComponentProps<typeof ModalContent>;
  bg?: string;
  color?: string;
  border?: string;
  headerColor?: string;
}

const overlayTransition: Transition = { duration: 0.2, ease: "easeOut" };
const contentTransition: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

export const SpringModal: React.FC<SpringModalProps> = ({
  isOpen,
  onClose,
  showClose,
  bgIcon,
  frontIcon,
  header,
  body,
  footer,
  secondaryLabel,
  onSecondaryClick,
  isSecondaryLoading = false,
  primaryLabel,
  onPrimaryClick,
  isPrimaryLoading = false,
  primaryDisabled = false,
  modalContentProps,
  bg,
  color = "white",
  primaryIcon,
  secondaryIcon,
  border,
  headerColor = "white",
  primaryBg,
  primaryColor,
  secondaryBg,
  secondaryColor,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered motionPreset="none">
      {/* Backdrop */}
      <ModalOverlay
        as={MotionOverlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={overlayTransition as any}
        bg="blackAlpha.600"
        backdropFilter="blur(4px)"
      />

      {/* Modal Content */}
      <ModalContent
        as={MotionContent}
        initial={{ scale: 0, rotate: 12.5, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        exit={{ scale: 0, rotate: 0, opacity: 0 }}
        transition={contentTransition as any}
        bgGradient="linear(to-br, violet.600, indigo.600)"
        color={color}
        borderRadius="lg"
        overflow="hidden"
        maxW="lg"
        mx="4"
        position="relative"
        zIndex={100}
        bg={bg}
        {...(border ? { border } : {})}
        {...modalContentProps}
      >
        {bgIcon && (
          <Box
            position="absolute"
            top="-24"
            left="-6"
            fontSize="12rem"
            opacity={0.2}
            transform="rotate(12deg)"
            zIndex={0}
            pointerEvents="none"
          >
            {bgIcon}
          </Box>
        )}

        <ModalHeader textAlign="center" mb={0} position="relative" zIndex={1} color={headerColor}>
          {frontIcon && (
            <Box
              bg="white"
              w="16"
              h="16"
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              mx="auto"
              mb="2"
              fontSize="3xl"
              color={bg ?? "grey.500"}
            >
              {frontIcon}
            </Box>
          )}
          <Box as="h3" fontSize="3xl" fontWeight="bold">
            {header}
          </Box>
        </ModalHeader>

        {showClose && (
          <ModalCloseButton
            position="absolute"
            top="2"
            right="2"
            color={color}
            opacity={0.8}
            _hover={{ opacity: 1 }}
            zIndex={2}
          />
        )}

        <ModalBody position="relative" zIndex={1} color={color}>
          <Box textAlign="center" borderRadius="md">{body}</Box>
        </ModalBody>

        {footer ? (
          <Box position="relative" zIndex={1} pb={6}>
            {footer}
          </Box>
        ) : (
          <ModalFooter position="relative" zIndex={1} pb={6}>
            <Stack w="full" gap={2} direction={["column", "row"]}>
              {secondaryLabel && onSecondaryClick && (
                <Button
                  flex="1"
                  variant="ghost"
                  color={secondaryColor || "white"}
                  onClick={onSecondaryClick}
                  isLoading={isSecondaryLoading}
                  isDisabled={isSecondaryLoading}
                  _hover={{ bg: secondaryBg ? secondaryBg : "whiteAlpha.300" }}
                  bg={secondaryBg || "whiteAlpha.100"}
                  border="1px solid"
                  borderColor="whiteAlpha.300"
                  borderRadius="lg"
                  boxShadow="md"
                  leftIcon={secondaryIcon || undefined}
                  py={3}
                >
                  {secondaryLabel}
                </Button>
              )}
              {primaryLabel && onPrimaryClick && (
                <Button
                  flex="1"
                  bg={primaryBg || "white"}
                  color={primaryColor || bg}
                  onClick={onPrimaryClick}
                  isLoading={isPrimaryLoading}
                  isDisabled={isPrimaryLoading || primaryDisabled}
                  _hover={{ bg: primaryBg ? primaryBg : "whiteAlpha.900" }}
                  border="none"
                  borderRadius="lg"
                  boxShadow="md"
                  leftIcon={primaryIcon || undefined}
                  py={3}
                >
                  {primaryLabel}
                </Button>
              )}
            </Stack>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
};
