import React from "react";
import {
  Box,
  Flex,
  Icon,
  Switch,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";

interface CustomToggleProps {
  iconA: React.ElementType; // Icon for state A
  iconB: React.ElementType; // Icon for state B
  isChecked: boolean; // Current state of the switch
  onToggle: () => void; // Function to handle the toggle action
  width?: string | number; // Width of the toggle switch
  height?: string | number; // Height of the toggle switch
  canEdit?: boolean;
}

const CustomToggle: React.FC<CustomToggleProps> = ({
  iconA,
  iconB,
  isChecked,
  onToggle,
  width,
  height,
  canEdit,
}) => {
  const bgColor = useColorModeValue("gray.200", "gray.700");
  const activeColor = useColorModeValue("primary", "blue.300");

  // Use responsive values for width and height with Chakra breakpoints
  const toggleWidth = useBreakpointValue({
    base: "60px", // For mobile screens (base breakpoint)
    md: width || "80px", // Default width or prop width for medium and larger screens
  });

  const toggleHeight = useBreakpointValue({
    base: "30px", // For mobile screens
    md: height || "40px", // Default height or prop height for medium and larger screens
  });

  const toggleCircleSize = useBreakpointValue({
    base: "28px", // Circle size for mobile
    md: "36px", // Circle size for larger screens
  });

  return (
    <Flex alignItems="center">
      <Box
        as="label"
        display="flex"
        alignItems="center"
        cursor="pointer"
        position="relative"
        width={toggleWidth}
        height={toggleHeight}
        bg={bgColor}
        borderRadius="full"
        padding="2px"
        transition="background-color 0.2s"
        _focus={{ boxShadow: "outline" }}
      >
        <Switch
          isChecked={isChecked}
          onChange={onToggle}
          size="md"
          isDisabled={!canEdit}
          position="absolute"
          opacity={0}
          width="100%"
          height="100%"
          zIndex={2}
          border={"1px solid black"}
        />
        <Box
          position="absolute"
          top="50%"
          left={isChecked ? `calc(100% - ${toggleCircleSize} - 2px)` : "2px"}
          transform="translateY(-50%)"
          width={toggleCircleSize}
          height={toggleCircleSize}
          borderRadius="full"
          bg={activeColor}
          display="flex"
          alignItems="center"
          justifyContent="center"
          transition="all 0.4s"
        >
          <Icon as={isChecked ? iconB : iconA} color="white" boxSize={4} />
        </Box>
      </Box>
    </Flex>
  );
};

export default CustomToggle;
