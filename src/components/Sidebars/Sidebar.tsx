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
  Fade,
} from "@chakra-ui/react";
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
  drawerState: DrawerStateOptions;
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

const Sidebar: React.FC<SidebarProps> = ({
  drawerState,
  canHalf,
  canFull,
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

  const floatButtonProps = isLeft
    ? { left: [4, 4, 5], right: "auto" }
    : { right: [4, 4, 5], left: "auto" };

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

  if (drawerState === "closed" && (canFull || canHalf)) {
    return (
      <Box
        position="absolute"
        top={["70px", "70px", 78]}
        {...floatButtonProps}
        zIndex={1}
        display={[
          side === "right" ? "flex" : "none",
          side === "right" ? "flex" : "none",
          "flex",
        ]}
        alignItems="center"
        justifyContent="center"
        color={theme.colors.iconColor}
        borderRadius="full"
        w={"40px"}
        h={"40px"}
        backgroundColor={"rgba(255,255,255,0.2)"}
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

  if (canHalf || canFull) {
    return (
      <>
        {fadeOnFull && drawerState === "fully-open" && (
          <Fade in={drawerState === "fully-open"}>
            <Box
              position={"fixed"}
              zIndex={98}
              bg={"rgba(0,0,0,0.5)"}
              height={"100svh"}
              width={"100svw"}
              top={0}
              left={0}
            />
          </Fade>
        )}

        <Box
          display={[
            side === "right" ? "flex" : "none",
            side === "right" ? "flex" : "none",
            "block",
          ]}
          position="fixed"
          top={0}
          {...(isLeft ? { left: 0 } : { right: 0 })}
          bottom={0}
          width={drawerState === "fully-open" ? 225 : 61}
          zIndex={120}
          bg="elementBG"
          boxShadow="xl"
          gap={0}
        >
          <VStack
            height="100%"
            pt={"60px"}
            spacing={0}
            overflowY={"auto"}
            w={"full"}
          >
            <HStack
              alignItems="center"
              justify={"space-between"}
              background={"elementBG"}
              py={1}
              px={2}
              zIndex={100}
              w={"full"}
            >
              {title && drawerState === "fully-open" && (
                <Heading
                  as={"h2"}
                  fontSize={"16px"}
                  style={{ color: theme.colors.primaryTextColor }}
                >
                  {title}
                </Heading>
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
                {((drawerState === "half-open" && canFull === false) ||
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
            {/* Content with Loading State */}
            <Box
              px={2}
              flex={1}
              w={"full"}
              overflowY={"auto"}
              overflowX={"hidden"}
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
                <>
                  {drawerState === "half-open" && halfOpenContent}
                  {drawerState === "fully-open" && fullyOpenContent}
                </>
              )}
            </Box>
          </VStack>
        </Box>
      </>
    );
  }
};
export default Sidebar;
