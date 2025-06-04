"use client";

import React, { useCallback, useRef, useState } from "react";
import { Box, HStack, useBreakpointValue, VStack } from "@chakra-ui/react";
import CarouselNavigationButton from "./CarouselNavigationButton";
import CarouselDots from "./CarouselDots";
import CarouselItem, { CarouselItemProps } from "./CarouselItem";
import useCarousel from "@/hooks/useCarousel";

interface CarouselProps {
  carouselItems: CarouselItemProps[];
  setParentIndex?: (index: number) => void;
}

const Carousel: React.FC<CarouselProps> = ({
  carouselItems,
  setParentIndex,
}) => {
  const { currentIndex, prevSlide, nextSlide, updateIndex } = useCarousel(
    carouselItems.length,
    setParentIndex
  );

  const touchStartX = useRef(0);
  const touchStartTime = useRef(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const itemsToShow =
    useBreakpointValue({
      base: 3,
      md: carouselItems.length < 5 ? 3 : 5,
    }) ?? 3;

  const debouncedSlide = useCallback(
    (action: () => void) => {
      if (!isTransitioning) {
        setIsTransitioning(true);
        action();
      }
    },
    [isTransitioning]
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartTime.current = Date.now();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const movementX = touchStartX.current - touchEndX;
    const movementTime = Date.now() - touchStartTime.current;

    if (Math.abs(movementX) > 50 && movementTime < 500) {
      e.preventDefault();
      if (movementX > 0) {
        debouncedSlide(nextSlide);
      } else {
        debouncedSlide(prevSlide);
      }
    }
  };

  return (
    <VStack
      width="100%"
      maxWidth={["100%", null, null, null, 1000]}
      spacing={4}
      mb={[0, 10]}
      position="relative"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}

    >
      <CarouselNavigationButton
        direction="left"
        onClick={() => debouncedSlide(prevSlide)}
        top="40%"
        side={["-30px", "-40px"]}
      />
      <CarouselNavigationButton
        direction="right"
        onClick={() => debouncedSlide(nextSlide)}
        top="40%"
        side={["-30px", "-40px"]}
      />

      {/* Carousel track container */}
      <Box width="100%">
        <HStack
          spacing={0}
          justifyContent="flex-start"
          position="relative"
          width={`${(carouselItems.length * 100) / itemsToShow}%`}
          transform={`translateX(-${
            (currentIndex - (itemsToShow - 1) / 2) *
            (100 / carouselItems.length)
          }%)`}
          transition="transform 0.5s ease-in-out"
          onTransitionEnd={() => setIsTransitioning(false)}
 
        >
          {carouselItems.map((item, index) => {
            let opacity = 1;
            let pointerEvents: "auto" | "none" = "auto";
            const distance = Math.abs(currentIndex - index);
            if (
              [0, 1].includes(currentIndex) &&
              itemsToShow === 5 &&
              [3, 4].includes(index)
            ) {
              opacity = 1;
            } else if (currentIndex === 0 && itemsToShow === 3 && index === 2) {
              opacity = 1;
            } else if (distance > Math.floor(itemsToShow / 2)) {
              opacity = 0;
              pointerEvents = "none";
            } else {
              opacity = 1;
              pointerEvents = "auto";
            }
            return (
              <HStack
                key={index}
                onClick={() =>
                  currentIndex === index
                    ? null
                    : debouncedSlide(() => updateIndex(index))
                }
                transition="opacity 0.5s ease-in-out, pointer-events 0.5s ease-in-out"
                opacity={opacity}
                cursor={
                  distance <= Math.floor(itemsToShow / 2)
                    ? "pointer"
                    : "default"
                }
                pointerEvents={pointerEvents}
                width={`${100 / carouselItems.length}%`}
                flex="0 0 auto"
              >
                <CarouselItem {...item} isSelected={index === currentIndex} />
              </HStack>
            );
          })}
        </HStack>
        <CarouselDots
          itemsCount={carouselItems.length}
          currentIndex={currentIndex}
          onDotClick={(index) => debouncedSlide(() => updateIndex(index))}
        />
      </Box>
    </VStack>
  );
};

export default Carousel;
