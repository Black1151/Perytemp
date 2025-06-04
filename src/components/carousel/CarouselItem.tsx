import React from "react";
import { Box, Flex, Icon, Image, VStack, Tooltip } from "@chakra-ui/react";
import { Lock } from "@mui/icons-material";

export interface CarouselItemProps {
  thumbNailImage: string;
  iconImage: string;
  backgroundImage: string;
  alt: string;
  name: string;
  description: string;
  isSelected?: boolean;
  appUrl: string;
  toolId: string;
  toolWfId: string;
  isUAGLocked: boolean;
  logoImage: string;
}

const CarouselItem: React.FC<CarouselItemProps> = ({
  thumbNailImage,
  alt,
  isSelected,
  isUAGLocked,
}) => {
  return (
    <VStack flex={1} height={[120, 150, 170, 200, 220]}>
      <Box
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize="contain"
        transition="height 0.5s ease-in-out"
        position="relative"
      >
        {/* Lock Icon */}
        {isUAGLocked && (
          <Tooltip label={"You do not have access to this tool"} hasArrow>
            <Flex
              position="absolute"
              top={[1, 2]}
              right={[1, 2]}
              zIndex={2}
              bg="white"
              border={"2px solid var(--chakra-colors-primary)"}
              borderRadius="full"
              justify="center"
              align="center"
              aspectRatio={1}
              p={[0.5, 1]}
              transition="all 0.5s ease-in-out"
              boxShadow="sm"
            >
              <Icon
                as={Lock}
                boxSize={
                  isSelected
                    ? ["0.75rem", "1rem", "1.25rem"]
                    : ["0.5rem", "0.75rem", "1rem"]
                }
                transition="all 0.5s ease-in-out"
                color="gray.700"
              />
            </Flex>
          </Tooltip>
        )}

        {/* Thumbnail Image */}
        <Box
          filter={isUAGLocked ? "brightness(0.35)" : undefined}
          transition="filter 0.3s ease-in-out"
          p={0}
          m={0}
        >
          <Image
            src={thumbNailImage}
            alt={alt}
            height={
              isSelected
                ? ["120px", "130px", "140px", "180px", "200px"]
                : ["90px", "100px", "110px", "150px", "160px"]
            }
            transition="height 0.3s ease-in-out"
          />
        </Box>
      </Box>
    </VStack>
  );
};

export default CarouselItem;
