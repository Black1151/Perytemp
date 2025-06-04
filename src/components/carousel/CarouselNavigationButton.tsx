import React from "react";
import { Box } from "@chakra-ui/react";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

interface CarouselNavigationButtonProps {
  direction: "left" | "right";
  onClick: () => void;
  top: string | string[] | undefined;
  side: string | string[] | undefined;
}

const CarouselNavigationButton: React.FC<CarouselNavigationButtonProps> = ({
  direction,
  onClick,
  top,
  side,
}) => {
  const IconComponent = direction === "left" ? ChevronLeft : ChevronRight;

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    (e.currentTarget as HTMLElement).style.transform = "scale(1.2)";
  };

  const handleMouseUp = (e: React.MouseEvent | React.TouchEvent) => {
    (e.currentTarget as HTMLElement).style.transform = "translateY(-25%)";
  };

  return (
    <Box
      aria-label={`${direction}-arrow`}
      position="absolute"
      left={direction === "left" ? side : undefined}
      right={direction === "right" ? side : undefined}
      top={top}
      zIndex={5}
      onClick={onClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      display={["none", null, "flex"]}
      alignItems="center"
      justifyContent="center"
      width="40px"
      height="80px"
      borderRadius="full"
      backgroundColor="primary"
      transition="background-color 0.3s, transform 0.3s"
      transform="translateY(-25%)"
      cursor="pointer"
      color="white"
    >
      <IconComponent style={{ fontSize: "48px", transition: "color 0.3s" }} />
    </Box>
  );
};

export default CarouselNavigationButton;
