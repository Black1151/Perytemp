import React from "react";
import { useBreakpointValue } from "@chakra-ui/react";
import CarouselNavigationButton from "./CarouselNavigationButton";

interface CarouselControlsProps {
  onPrev: () => void;
  onNext: () => void;
}

const CarouselControls: React.FC<CarouselControlsProps> = ({
  onPrev,
  onNext,
}) => {
  const top = useBreakpointValue({ base: "40%", md: "40%" });
  const side = useBreakpointValue({ base: "-30px", md: "-40px" });

  return (
    <>
      <CarouselNavigationButton
        direction="left"
        onClick={onPrev}
        top={top}
        side={side}
      />
      <CarouselNavigationButton
        direction="right"
        onClick={onNext}
        top={top}
        side={side}
      />
    </>
  );
};

export default CarouselControls;
