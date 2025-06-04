import React from "react";
import { HStack } from "@chakra-ui/react";
import Dot from "./Dot";

interface CarouselDotsProps {
  itemsCount: number;
  currentIndex: number;
  onDotClick: (index: number) => void;
}

const CarouselDots: React.FC<CarouselDotsProps> = ({
  itemsCount,
  currentIndex,
  onDotClick,
}) => (
  <HStack
    pb={4}
    spacing={[2, 8]}
    justifyContent="center"
    alignItems="center"
    width="full"
    display={["none", null, "flex"]}
    // mt={4}
  >
    {Array.from({ length: itemsCount }).map((_, index) => (
      <Dot
        key={index}
        isActive={index === currentIndex}
        onClick={() => onDotClick(index)}
      />
    ))}
  </HStack>
);

export default CarouselDots;
