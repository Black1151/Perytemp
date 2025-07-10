"use client";

import React, { useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Heading,
  useTheme,
  Center,
  Spinner,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Close,
  Menu,
  SvgIconComponent,
} from "@mui/icons-material";
import { DrawerStateOptions } from "@/components/Sidebars/useDrawerState";

type SidebarSide = "left" | "right";

export interface SidebarProps {
  drawerState: DrawerStateOptions; // "closed" | "half-open" | "fully-open"
  canHalf?: boolean;
  canFull?: boolean;
  onOpen?: () => void;
  onToggle?: () => void;
  onClose?: () => void;
  title?: string;
  side?: SidebarSide;
  loading?: boolean;
  halfOpenContent?: React.ReactNode;
  fullyOpenContent?: React.ReactNode;
  fadeOnFull?: boolean;
  openButtonIcon?: SvgIconComponent;
}

const MotionBox = motion(Box);
const MotionDiv = motion("div");
const MotionSpan = motion("span");

const Sidebar: React.FC<SidebarProps> = ({
  drawerState,
  canHalf = false,
  canFull = false,
  onOpen,
  onToggle,
  onClose,
  title,
  side = "left",
  loading = false,
  halfOpenContent,
  fullyOpenContent,
  fadeOnFull = false,
  openButtonIcon,
}) => {
  const theme = useTheme();
  const isLeft = side === "left";

  // Icon variants
  const collapseIcon = isLeft ? (
    <ChevronLeft style={{ fontSize: "1.4rem", cursor: "pointer" }} />
  ) : (
    <ChevronRight style={{ fontSize: "1.4rem", cursor: "pointer" }} />
  );
  const expandIcon = isLeft ? (
    <ChevronRight style={{ fontSize: "1.4rem", cursor: "pointer" }} />
  ) : (
    <ChevronLeft style={{ fontSize: "1.4rem", cursor: "pointer" }} />
  );
  const OpenIcon = openButtonIcon || Menu;

  // Prevent body scroll when fully open + fadeOnFull
  useEffect(() => {
    if (drawerState === "fully-open" && fadeOnFull) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [drawerState, fadeOnFull]);

  // If the drawer is closed but either half or full is possible → show a floating button
  if (drawerState === "closed" && (canHalf || canFull)) {
    return (
      <Box
        position="absolute"
        top={["70px", "70px", 78]}
        {...(isLeft
          ? { left: [4, 4, 5], right: "auto" }
          : { right: [4, 4, 5], left: "auto" })}
        zIndex={160}
        display={[
          side === "right" ? "flex" : "none",
          side === "right" ? "flex" : "none",
          "flex",
        ]}
        alignItems="center"
        justifyContent="center"
        color={theme.colors.iconColor}
        borderRadius="full"
        w="40px"
        h="40px"
        backgroundColor="rgba(255,255,255,0.2)"
        border={`1px solid ${theme.colors.iconColor}`}
        p={1}
        transform="scale(1)"
        transition="transform 0.2s ease-in-out"
        _hover={{ transform: "scale(1.05)", bg: "rgba(255,255,255, 0.35)" }}
      >
        <OpenIcon
          onClick={onOpen}
          cursor="pointer"
          style={{ fontSize: "1.5rem" }}
        />
      </Box>
    );
  }

  // Otherwise, render the actual drawer (either half-open or fully-open)
  return (
    <>
      {/* Fade Overlay when fully open */}
      <AnimatePresence>
        {fadeOnFull && drawerState === "fully-open" && (
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100svh",
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 98,
            }}
          />
        )}
      </AnimatePresence>

      {/* Drawer Container */}
      <MotionBox
        layout
        position="fixed"
        top={0}
        bottom={0}
        {...(isLeft ? { left: 0 } : { right: 0 })}
        zIndex={160}
        bg="elementBG"
        boxShadow="xl"
        overflow="hidden"
        display={[
          side === "right" ? "flex" : "none",
          side === "right" ? "flex" : "none",
          "block",
        ]}
        // Animate width between 61px (half-open) and 225px (fully-open)
        animate={{
          width: drawerState === "fully-open" ? 225 : 61,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <VStack h="100%" pt="60px" spacing={0} overflowY="auto" w="full">
          {/* Header (Title + Icons) */}
          <HStack
            alignItems="center"
            justify="space-between"
            background="elementBG"
            py={1}
            px={2}
            zIndex={100}
            w="full"
          >
            {/* Title shown only when fully-open */}
            {title && drawerState === "fully-open" && (
              <MotionDiv
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                style={{ flex: 1 }}
              >
                <Heading
                  as="h2"
                  fontSize="16px"
                  color={theme.colors.primaryTextColor}
                >
                  {title}
                </Heading>
              </MotionDiv>
            )}

            <HStack
              spacing={2}
              justify={
                side === "left"
                  ? "flex-end"
                  : drawerState === "fully-open"
                    ? "flex-end"
                    : "flex-start"
              }
              flex={1}
            >
              {/* Collapse button (visible in fully-open only if canHalf) */}
              {drawerState === "fully-open" && canHalf && (
                <Box
                  color={theme.colors.primary}
                  onClick={onToggle}
                  m={0}
                  p={0}
                  zIndex={1}
                >
                  {collapseIcon}
                </Box>
              )}

              {/* Expand button (visible in half-open only if canFull) */}
              {drawerState === "half-open" && canFull && (
                <Box
                  color={theme.colors.primary}
                  onClick={onToggle}
                  m={0}
                  p={0}
                  zIndex={1}
                >
                  {expandIcon}
                </Box>
              )}

              {/* Close button (visible when half-open without canFull or when fully-open) */}
              {((drawerState === "half-open" && !canFull) ||
                drawerState === "fully-open") && (
                <Box
                  color={theme.colors.primary}
                  onClick={onClose}
                  m={0}
                  p={0}
                  zIndex={1}
                >
                  <Close
                    style={{
                      fontSize: "1.4rem",
                      cursor: "pointer",
                    }}
                  />
                </Box>
              )}
            </HStack>
          </HStack>

          {/* Content Area */}
          <Box
            px={2}
            flex={1}
            w="full"
            h="full"
            overflowY="auto"
            overflowX="hidden"
            css={{
              "@media (max-width: 768px)": {
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              },
            }}
          >
            {loading ? (
              <Center h="100%">
                <Spinner size="lg" color={theme.colors.primary} />
              </Center>
            ) : (
              <AnimatePresence mode="wait">
                {/* When half-open, show halfOpenContent with simple fade/slide */}
                {drawerState === "half-open" && halfOpenContent && (
                  <MotionDiv
                    key="half"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    style={{ height: "100%" }}
                  >
                    {halfOpenContent}
                  </MotionDiv>
                )}

                {/* When fully-open, show fullyOpenContent with fade/slide */}
                {drawerState === "fully-open" && fullyOpenContent && (
                  <MotionDiv
                    key="full"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    style={{ height: "100%" }}
                  >
                    {fullyOpenContent}
                  </MotionDiv>
                )}
              </AnimatePresence>
            )}
          </Box>
        </VStack>
      </MotionBox>
    </>
  );
};

export default Sidebar;
