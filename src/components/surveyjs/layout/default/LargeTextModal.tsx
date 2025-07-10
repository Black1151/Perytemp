"use client";

import { useRef, useState, useEffect } from "react";
import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalHeaderProps,
  ModalOverlay,
  Box,
  useTheme,
} from "@chakra-ui/react";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import PerygonCard from "@/components/layout/PerygonCard";
import { motion } from "framer-motion";
import { BoxProps } from "@chakra-ui/react";

const MotionBox = motion<BoxProps>(Box);

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  showButtons?: {
    close: boolean;
    confirm: boolean;
  };
  title?: string | React.ReactNode;
  titleProps?: ModalHeaderProps;
  bodyContent?: string | React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  icon?: React.ReactNode;
}

const LargeTextModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  showButtons = {
    close: true,
    confirm: true,
  },
  title = "Confirm Action",
  titleProps = {},
  bodyContent = "Are you sure you want to perform this action?",
  confirmLabel = "Confirm",
  cancelLabel = "Close",
  icon,
}) => {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [showTopShadow, setShowTopShadow] = useState(false);
  const [showBottomShadow, setShowBottomShadow] = useState(false);
  const theme = useTheme();

  const handleScroll = () => {
    if (!bodyRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = bodyRef.current;

    setShowTopShadow(scrollTop > 0);
    setShowBottomShadow(scrollTop + clientHeight < scrollHeight);
  };

  // run once in case content is already scrollable on mount
  useEffect(() => {
    if (!bodyRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = bodyRef.current;
    setShowTopShadow(scrollTop > 0);
    setShowBottomShadow(scrollTop + clientHeight < scrollHeight);
  }, [bodyContent]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      returnFocusOnClose={false}
      size={"6xl"}
    >
      {" "}
      <ModalOverlay />
      <ModalContent
        bgColor={theme.colors.elementBG}
        maxH={"75vh"}
      >
        <PerygonCard>
          {icon && (
            <Flex
              justifyContent={"center"}
              alignItems={"center"}
              width={"100%"}
              mb={0}
            >
              {icon}
            </Flex>
          )}
          <ModalHeader {...titleProps}>
            <Flex
              justifyContent={"center"}
              alignItems={"center"}
              width={"100%"}
              color={theme.colors.primaryTextColour}
            >
              {title}
            </Flex>
          </ModalHeader>

          <ModalBody
            position="relative"
            p={0}
            textAlign="center"
            w="auto"
            borderRadius="lg"
            overflow="hidden"
            mx={[2, 4, 8]}
            color={theme.colors.primaryTextColour}
          >
            {/* Scrollable box (now `position="relative"`) */}
            <Box
              ref={bodyRef}
              onScroll={handleScroll}
              maxH="75vh"
              overflowY="auto"
              position="relative"
            >
              {/* Top shadow (sticky at top of scroll container) */}
              <MotionBox
                style={{
                  position: "sticky",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "16px",
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0.2), transparent)",
                  pointerEvents: "none",
                  zIndex: 1,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: showTopShadow ? 1 : 0 }}
                transition={{ duration: 0.2 }}
              />
              <Flex px={[2, 4, 4]} color={theme.colors.primaryTextColor}>
                {bodyContent}
              </Flex>
              <MotionBox
                style={{
                  position: "sticky",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "16px",
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.2), transparent)",
                  pointerEvents: "none",
                  zIndex: 1,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: showBottomShadow ? 1 : 0 }}
                transition={{ duration: 0.2 }}
              />
            </Box>
          </ModalBody>

          <ModalFooter alignContent={"center"} justifyContent={"center"}>
            {showButtons.close && (
              <Button
                mr={3}
                onClick={onClose}
                bgColor="darkGray"
                border="1px solid darkGray"
                color="white"
                _hover={{ color: "white", backgroundColor: "red.600" }}
                display="flex"
                alignItems="center"
                gap={[0, 0, 2]}
                lineHeight={0}
              >
                <CloseIcon />
                {cancelLabel}
              </Button>
            )}
            {showButtons.confirm && (
              <Button
                bgColor="darkGray"
                border="1px solid lightGray"
                color="white"
                _hover={{ color: "white", backgroundColor: "green.600" }}
                onClick={onConfirm}
                display="flex"
                alignItems="center"
                gap={[0, 0, 2]}
                lineHeight={0}
              >
                <DoneIcon />
                {confirmLabel}
              </Button>
            )}
          </ModalFooter>
        </PerygonCard>
      </ModalContent>
    </Modal>
  );
};

export default LargeTextModal;
