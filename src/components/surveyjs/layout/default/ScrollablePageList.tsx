import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Flex,
  IconButton,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { motion } from "framer-motion";
import { PageListOption } from "@/types/form";
import { PageModel } from "survey-core";

// Create a motion.div to animate the filling of the progress bar
const MotionBox = motion(Box);

interface ScrollablePageListProps {
  pageListOptions: PageListOption[];
  pageNo: number;
  jumpToPage: (page: PageModel) => void;
  animationDuration: number;
  previousPageNo: React.MutableRefObject<number>;
  width?: string | number; // Width of the toggle switch
}

const ScrollablePageList: React.FC<ScrollablePageListProps> = ({
  pageListOptions,
  pageNo,
  jumpToPage,
  animationDuration,
  previousPageNo,
  width,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Use responsive values for size of Chevron Arrows
  const chevronSize = useBreakpointValue({
    base: "28px", // For mobile screens (base breakpoint)
    md: width || "40px", // Default width or prop width for medium and larger screens
  });

  const barHeight = useBreakpointValue({
    base: 14,
    md: 22,
  });

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      const buffer = 10; // The buffer in pixels to allow before hiding the right arrow

      setCanScrollLeft(scrollLeft > buffer);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - buffer);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const scrollAmount = direction === "left" ? -150 : 150;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  useEffect(() => {
    // Call handleScroll initially to set arrow visibility correctly
    handleScroll();

    // Add a resize observer to handle container size changes
    const resizeObserver = new ResizeObserver(() => {
      handleScroll();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Cleanup the observer when the component unmounts
    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, [pageListOptions]);

  return (
    <Flex
      position="relative"
      alignItems="center"
      flex={"1 1 auto"}
      overflow={"hidden"}
    >
      {/* Scroll Left Arrow */}
      <IconButton
        aria-label="Scroll Left"
        icon={<ChevronLeft sx={{ fontSize: chevronSize }} />}
        position={"sticky"}
        color={canScrollLeft ? "primary" : "transparent"}
        left="0"
        zIndex="1"
        bg="transparent"
        border="none"
        height="auto"
        _hover={{ bg: "transparent" }}
        onClick={() => scroll("left")}
      />
      <Flex
        ref={containerRef}
        overflow="auto"
        flex={1}
        onScroll={handleScroll}
        sx={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {pageListOptions.map((pageOption) => {
          const isFilled = pageNo >= pageOption.index;
          const isGoingForward = pageNo > previousPageNo.current;
          const isGoingBackward = pageNo < previousPageNo.current;

          const forwardDelay = pageOption.index * animationDuration;
          const backwardDelay =
            (pageListOptions.length - pageOption.index - 1) * animationDuration;

          const delay = isGoingForward
            ? forwardDelay
            : isGoingBackward
              ? backwardDelay
              : 0;

          return (
            <Flex
              key={pageOption.index}
              textAlign="center"
              flex={"1"}
              mx={1}
              flexDirection="column"
              alignItems="center"
              justifyContent="flex-start"
              minW="85px"
              // maxW="95%"
              maxW="300px"
              height="full"
              cursor="pointer"
              onClick={() => jumpToPage(pageOption.page)}
            >
              <Box
                position="relative"
                w="100%"
                h={`${barHeight}px`} // This is the height of the progress bar (you can customize)
                bg="gray.300"
                mb={2}
                overflow={"hidden"}
                display="flex"
                alignItems="center"
                borderRadius="md"
                style={{
                  clipPath:
                    "polygon(0% 0%, 95% 0%, 100% 50%, 95% 100%, 0% 100%, 5% 50%, 0% 0%)",
                }}
              >
                {/* Progress Bar */}
                <MotionBox
                  position="relative"
                  top={0}
                  left={0}
                  h="100%"
                  bg="primary"
                  borderRadius="md"
                  initial={{ width: 0 }}
                  animate={{ width: isFilled ? "100%" : "0%" }}
                  transition={{
                    duration: animationDuration,
                    ease: "easeInOut",
                    delay,
                  }}
                  style={{
                    clipPath:
                      "polygon(0% 0%, 95% 0%, 100% 50%, 95% 100%, 0% 100%, 5% 50%, 0% 0%)",
                  }}
                />
              </Box>

              {/* Text Below Progress Bar */}
              <Text
                color={pageNo === pageOption.index ? "primary" : "gray.500"}
                fontWeight={pageNo === pageOption.index ? "bold" : "normal"}
                fontSize={
                  pageNo === pageOption.index ? ["xs", "xs", "md"] : "xs"
                }
              >
                {pageOption.title}
              </Text>
            </Flex>
          );
        })}
      </Flex>
      {/* Scroll Right Arrow */}
      <IconButton
        aria-label="Scroll Right"
        icon={<ChevronRight sx={{ fontSize: chevronSize }} />}
        position="sticky"
        color={canScrollRight ? "primary" : "transparent"}
        right="0"
        zIndex="1"
        bg="transparent"
        height="auto"
        border="none"
        _hover={{ bg: "transparent" }}
        onClick={() => scroll("right")}
      />
    </Flex>
  );
};

export default ScrollablePageList;
