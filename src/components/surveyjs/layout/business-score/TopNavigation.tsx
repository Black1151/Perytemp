"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Box,
  Flex,
  IconButton,
  Circle,
  Text,
  useTheme,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Check, ChevronLeft, ChevronRight } from "@mui/icons-material";
import { useWorkflow } from "@/providers/WorkflowProvider";
import { FormNavigationProps } from "@/types/form";

const TopNavigation: React.FC<FormNavigationProps> = ({
  pageListOptions,
  pageNo,
  isFirstPage,
  isLastPage,
  jumpToPage,
  prevPage,
  nextPage,
}) => {
  const theme = useTheme();
  const [maxPage, setMaxPage] = useState(pageNo);
  const { currentStage } = useWorkflow();

  const pagesAllowed = useBreakpointValue({ base: 3, md: 5 }) ?? 5;
  const [totalPages, setTotalPages] = useState(pageListOptions.length);

  useEffect(() => {
    setTotalPages(pageListOptions.length);
  }, [pageListOptions]);

  // Used if you uncomment the arrows below in return
  const handleFirst = () => jumpToPage(pageListOptions[0].page);
  const handleLast = () => jumpToPage(pageListOptions[totalPages - 1].page);
  const itemSize = useBreakpointValue({ base: 70, md: 100 }) ?? 100;
  const gapSize = useBreakpointValue({ base: 0, md: 8 }) ?? 8;
  const totalItemSize = useMemo(() => itemSize + gapSize, [itemSize, gapSize]);
  const totalBarSize = useMemo(
    () => pagesAllowed * totalItemSize,
    [pagesAllowed, totalItemSize]
  );
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [offSet, setOffset] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => {
      requestAnimationFrame(() => {
        if (containerRef.current) {
          setContainerWidth(containerRef.current.offsetWidth);
        }
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [pageListOptions]);

  useEffect(() => {
    if (!containerWidth) return;

    const centerOfCurrentItem = pageNo * totalItemSize + itemSize / 2;
    let newOffset = centerOfCurrentItem - containerWidth / 2;

    const maxOffset = pageListOptions.length * totalItemSize - containerWidth;
    if (newOffset < 0) newOffset = 0;
    if (newOffset > maxOffset) newOffset = maxOffset;

    setOffset(newOffset);
  }, [
    pageNo,
    containerWidth,
    itemSize,
    gapSize,
    totalItemSize,
    pageListOptions.length,
  ]);

  useEffect(() => {
    if (pageNo > maxPage) {
      setMaxPage(pageNo);
    }
  }, [pageNo]);

  return (
    <Box
      position="sticky"
      top={"60px"}
      zIndex={90}
      w="full"
      bg={theme.colors.elementBG}
      borderRadius="md"
      px={[1, 3]}
      py={[1, 2]}
      boxShadow="md"
    >
      <Flex justify="center" align="center" gap={[1, 2]}>
        {/* Left Navigation Controls */}

        {/*Not Required Go To FIRST */}
        {/*<IconButton*/}
        {/*  aria-label="First page"*/}
        {/*  icon={<FirstPage />}*/}
        {/*  onClick={handleFirst}*/}
        {/*  isDisabled={isFirstPage}*/}
        {/*  size={["xs", "sm"]}*/}
        {/*/>*/}
        <IconButton
          aria-label="Previous"
          icon={<ChevronLeft />}
          bg="transparent"
          _hover={{ bg: "transparent" }}
          onClick={prevPage}
          color={!isFirstPage ? "primary" : "transparent"}
          isDisabled={isFirstPage}
          size={["xs", "sm"]}
          border="none"
        />

        <Box maxW={`${totalBarSize}px`} overflow={"hidden"} ref={containerRef}>
          <Flex
            justify={"flex-start"}
            align={"flex-start"}
            gap={`${gapSize}px`}
            transform={"auto"}
            translateX={`-${offSet}px`}
            transition={"transform 0.3s ease-out"}
            py={2}
          >
            {pageListOptions.map(({ page, title }, index) => {
              const isCompleted = index < maxPage;
              const isCurrent = index === pageNo;
              const isNotStarted = index > pageNo;

              // Circle background color:
              let circleBg = "gray.200";
              let circleColor = "gray.700"; // text/icon color
              let circleContent: React.ReactNode = index + 1; // default label

              if (currentStage?.bpInstStatus !== 3) {
                if (isCompleted) {
                  circleBg = theme.colors.seduloGreen;
                  circleColor = "white";
                  circleContent = <Check fontSize="small" />;
                } else if (isCurrent) {
                  circleBg = theme.colors.elementBg;
                  circleColor = theme.colors.primaryTextColor;
                  // could show numeric label or something like a spinner icon, etc.
                } else if (isNotStarted) {
                  circleBg = "gray.200";
                  circleColor = "gray.600";
                }
              } else {
                circleBg = theme.colors.seduloGreen;
                circleColor = "white";
                circleContent = <Check fontSize="small" />;
              }

              const distanceFromCurrent = Math.abs(index - pageNo);
              let scaleValue = 1;
              if (distanceFromCurrent === 1) {
                scaleValue = 0.9;
              } else if (distanceFromCurrent > 1) {
                scaleValue = 0.8;
              }

              return (
                <Flex
                  key={index}
                  direction="column"
                  align="center"
                  justify="flex-start"
                  flexShrink={0}
                  w={`${itemSize}px`}
                  transform={`scale(${scaleValue})`}
                  transition={"transform 0.5s ease-out"}
                >
                  <Circle
                    size={"26px"}
                    bg={circleBg}
                    color={circleColor}
                    fontWeight="bold"
                    cursor="pointer"
                    onClick={() => jumpToPage(page)}
                    border={
                      isCurrent
                        ? `2px solid ${theme.colors.secondaryTextColor}`
                        : isCompleted
                          ? "2px solid transparent"
                          : "none"
                    }
                    boxShadow={
                      isCurrent ? `0 0 0 2px ${theme.colors.primary}` : "none"
                    }
                    transition="background-color 0.2s"
                  >
                    {circleContent}
                  </Circle>
                  <Box
                    fontSize={["xs", "xs", "md"]}
                    mt={1}
                    textAlign="center"
                    whiteSpace="normal"
                    wordBreak="normal"
                    lineHeight="short"
                  >
                    <Text
                      color={
                        isCurrent
                          ? theme.colors.primary
                          : theme.colors.primaryTextColor
                      }
                      fontWeight={isCurrent ? "bold" : undefined}
                    >
                      {title}
                    </Text>
                  </Box>
                </Flex>
              );
            })}
          </Flex>
        </Box>
        <IconButton
          aria-label="Next"
          icon={<ChevronRight />}
          color={!isLastPage ? "primary" : "transparent"}
          bg={"transparent"}
          _hover={{ bg: "transparent" }}
          onClick={nextPage}
          isDisabled={isLastPage}
          size={["xs", "sm"]}
          border="none"
        />
        {/*Not Required Go To LAST */}
        {/*<IconButton*/}
        {/*  aria-label="Last page"*/}
        {/*  icon={<LastPage />}*/}
        {/*  onClick={handleLast}*/}
        {/*  isDisabled={isLastPage}*/}
        {/*  size={["xs", "sm"]}*/}
        {/*/>*/}

        <Flex
          // Position absolutely at the bottom center of this container
          position="absolute"
          display={["none", "none", "flex"]}
          bottom="4px"
          left="50%"
          transform="translateX(-50%)"
          align="center"
          gap="4px" // space between small circles
        >
          {pageListOptions.map((_, i) => {
            const isCompleted = i < maxPage;
            const isCurrent = i === pageNo;
            const isNotStarted = i > maxPage;

            let miniCircleBg = "gray.400";

            if (isCompleted) {
              miniCircleBg = theme.colors.seduloGreen;
            } else if (isNotStarted) {
              miniCircleBg = "gray.300";
            }

            // If it's current, let's make it more obvious
            let miniCircleSize = "6px";
            let miniCircleBorder = "none";

            if (isCurrent) {
              miniCircleBg = theme.colors.primary; // or any highlight color
              miniCircleSize = "10px"; // bigger circle
              miniCircleBorder = `2px solid ${theme.colors.seduloGreen}`;
            }

            return (
              <Box
                key={i}
                as="span"
                w={miniCircleSize}
                h={miniCircleSize}
                borderRadius="50%"
                bg={miniCircleBg}
                border={miniCircleBorder}
              />
            );
          })}
        </Flex>
      </Flex>
    </Box>
  );
};

export default TopNavigation;
