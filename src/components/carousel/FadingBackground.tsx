import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";

interface FadingBackgroundProps {
  images: string[];
  currentIndex: number;
}

const FadingBackground: React.FC<FadingBackgroundProps> = ({
  images,
  currentIndex,
}) => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    // Reset to scale=1 every time a new image is shown
    setScale(1);
    // Then zoom in after a short delay
    const timer = setTimeout(() => {
      setScale(2);
    }, 100);

    return () => clearTimeout(timer);
  }, [currentIndex]);

  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      zIndex={-1}
      backgroundImage={`url(${images[currentIndex]})`}
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      backgroundSize="cover"
      transformOrigin="center center"
      transition="background-image 1s, transform 30s ease-out"
      transform={`scale(${scale})`}
    />
  );
};

export default FadingBackground;
