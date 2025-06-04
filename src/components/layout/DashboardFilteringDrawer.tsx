"use client";

import React, { memo, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Checkbox,
  Select,
  Spinner,
  Text,
  useBreakpointValue,
  useTheme,
  VStack,
  Fade,
  Flex,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Clear, Close, FilterAlt, Refresh } from "@mui/icons-material";
import { FilterOptionGroup } from "@/app/(site)/(apps)/happiness-score/dashboard/company-dashboard/types";
import { hideScrollbar } from "@/utils/style/style-utils";

interface RightHandNavigationDrawerProps {
  title?: string;
  handleCheckboxChange: (
    groupIndex: number,
    optionIndex: number,
    isChecked: boolean
  ) => void;
  filterOptions: FilterOptionGroup[];
  clearAllFilters: () => void;
  weekOptions: string[];
  selectedWeek: string | null;
  onWeekChange: (week: string) => void;
  drawerState: "closed" | "fully-open";
  setDrawerState: (state: "closed" | "fully-open") => void;
  isUpdating: boolean;
  refreshPage: () => void;
  scrollRef: React.RefObject<HTMLDivElement>;
  saveScrollPosition: () => void;
}

const displayNameMappings: { [key: string]: string } = {
  "Contract Type Name": "Contract Type",
  "Dept Name": "Department",
  "Job Level Name": "Job Level",
};

export const DashboardFilteringDrawer = memo(function DashboardFilteringDrawer({
  handleCheckboxChange,
  filterOptions,
  title,
  clearAllFilters,
  weekOptions,
  selectedWeek,
  onWeekChange,
  drawerState,
  setDrawerState,
  isUpdating,
  refreshPage,
  scrollRef,
  saveScrollPosition,
}: RightHandNavigationDrawerProps) {
  const theme = useTheme();
  const MotionBox = motion(Box);

  // ─── Move all useBreakpointValue calls OUTSIDE any conditional ───
  const iconFontSize = useBreakpointValue({ base: "1.3rem", lg: "1.5rem" });

  // For the "closed" button’s background and hover, call these hooks unconditionally:
  const closedBg = useBreakpointValue({
    base: "rgba(66, 66, 66, 0.6)",
    md: "rgba(255,255,255,0.2)",
  });
  const closedHoverBg = useBreakpointValue({
    base: "rgba(66, 66, 66, 0.75)",
    md: "rgba(255,255,255, 0.35)",
  });

  const drawerRef = useRef<HTMLDivElement>(null);

  const toggleDrawer = () => {
    setDrawerState(drawerState === "fully-open" ? "closed" : "fully-open");
  };

  useEffect(() => {
    if (drawerState === "fully-open") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [drawerState]);

  return (
    <>
      {drawerState === "closed" && (
        <Box
          position="absolute"
          top={["72px", null, "74px"]}
          right={[3, 4, 5]}
          zIndex={1}
          display={["flex"]}
          alignItems="center"
          justifyContent="center"
          color={theme.colors.iconColor}
          borderRadius="full"
          w="40px"
          h="40px"
          backgroundColor={closedBg}
          border={`1px solid ${theme.colors.iconColor}`}
          p={1}
          transform="scale(1)"
          transition="transform 0.2s ease-in-out"
          _hover={{
            transform: "scale(1.05)",
            bg: closedHoverBg,
          }}
        >
          <FilterAlt
            onClick={toggleDrawer}
            cursor="pointer"
            style={{ fontSize: iconFontSize }}
          />
        </Box>
      )}

      {drawerState === "fully-open" && (
        <Fade in={true}>
          <Box
            position="fixed"
            zIndex={98}
            bg="rgba(0,0,0,0.5)"
            height="100svh"
            width="100svw"
            top={0}
            left={0}
          />
        </Fade>
      )}

      <MotionBox
        ref={drawerRef}
        display="block"
        position="fixed"
        top={0}
        right={0}
        bottom={0}
        width={225}
        zIndex={150}
        bg="elementBG"
        boxShadow="xl"
        transform={
          drawerState === "fully-open" ? "translateX(0)" : "translateX(100%)"
        }
        pb={[20, null, 0]}
      >
        <VStack align="stretch" height="100%" pt="60px">
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            gap={2}
            pr={2}
            position="absolute"
            right={0}
            zIndex={2}
            bg="elementBG"
            w="full"
            pl={5}
            color={theme.colors.primaryTextColor}
            fontWeight="bold"
            fontSize="1.2rem"
          >
            Filter Options
            <Box onClick={() => setDrawerState("closed")} zIndex={1} pt={1}>
              <Close
                style={{
                  cursor: "pointer",
                  color: theme.colors.primary,
                }}
              />
            </Box>
          </Box>

          {drawerState === "fully-open" && title && (
            <Box px={4}>
              <Text color={theme.colors.primaryTextColor}>{title}</Text>
            </Box>
          )}

          {drawerState === "fully-open" && (
            <>
              <Box px={4} mt={4}>
                <Select
                  placeholder="Select Week"
                  value={selectedWeek || ""}
                  onChange={(e) => onWeekChange(e.target.value)}
                  isDisabled={isUpdating}
                  color={theme.colors.primaryTextColor}
                  sx={{
                    option: {
                      backgroundColor: theme.colors.elementBG,
                    },
                  }}
                >
                  {weekOptions.map((week) => (
                    <option
                      key={week}
                      value={week}
                      style={{ paddingLeft: "10px" }}
                      color={theme.colors.themeTextColor}
                    >
                      {week}
                    </option>
                  ))}
                </Select>
              </Box>
              <Box
                ref={scrollRef}
                flex={1}
                position="relative"
                zIndex={1}
                px={4}
                p={3}
                overflowY="auto"
                sx={{
                  "@media (max-width: 400px)": {
                    ...hideScrollbar,
                  },
                }}
                onScroll={saveScrollPosition}
              >
                <VStack spacing={4} align="stretch" width="100%">
                  <Button
                    width="100%"
                    variant="red"
                    onClick={clearAllFilters}
                    isDisabled={isUpdating}
                    leftIcon={<Clear component="svg" />}
                  >
                    {isUpdating ? <Spinner size="sm" /> : "Clear Filters"}
                  </Button>
                  <Button
                    width="100%"
                    variant="green"
                    onClick={refreshPage}
                    leftIcon={<Refresh component="svg" />}
                  >
                    {isUpdating ? <Spinner size="sm" /> : "Refresh Data"}
                  </Button>
                </VStack>

                <VStack spacing={4} align="stretch" width="100%" mt={4}>
                  {filterOptions &&
                    filterOptions.map((group, groupIndex) => {
                      const hasOptions = group.options.length > 0;
                      if (!hasOptions) return null;
                      return (
                        <Box
                          key={group.label}
                          border="1px solid"
                          borderColor={theme.colors.primary}
                          borderRadius="md"
                          p={2}
                          fontSize={["14px", "16px"]}
                          boxShadow="lg"
                        >
                          <Box
                            width="100%"
                            display="flex"
                            justifyContent="center"
                          >
                            <Text
                              fontWeight="bold"
                              mb={2}
                              bg={theme.colors.primary}
                              color="white"
                              width="100%"
                              p={2}
                              fontSize={["14px", "16px"]}
                              borderRadius="md"
                            >
                              {displayNameMappings[group.label] || group.label}
                            </Text>
                          </Box>
                          <VStack align="start" spacing={2}>
                            {group.options.map((option, optionIndex) => (
                              <Checkbox
                                key={option.value}
                                size={["sm", "md"]}
                                isChecked={option.isSelected}
                                isDisabled={
                                  isUpdating ||
                                  (!option.isSelected && option.isDisabled)
                                }
                                onChange={(e) =>
                                  handleCheckboxChange(
                                    groupIndex,
                                    optionIndex,
                                    e.target.checked
                                  )
                                }
                              >
                                <Text color={theme.colors.primaryTextColor}>
                                  {option.label}
                                </Text>
                              </Checkbox>
                            ))}
                          </VStack>
                        </Box>
                      );
                    })}
                </VStack>
              </Box>
              {isUpdating && (
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  right={0}
                  bottom={0}
                  bg="rgba(255, 255, 255, 0.6)"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  zIndex={10}
                >
                  <Spinner size="lg" />
                </Box>
              )}
            </>
          )}
        </VStack>
      </MotionBox>
    </>
  );
});
