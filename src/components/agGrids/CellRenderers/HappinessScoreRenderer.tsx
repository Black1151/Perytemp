import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import useColor from "@/hooks/useColor";

interface HappinessScoreRendererProps {
  value: number | null;
}

const HappinessScoreRenderer: React.FC<HappinessScoreRendererProps> = ({
  value,
}) => {
  const { getColor } = useColor();
  if (value === null || value === undefined) {
    return (
      <Box textAlign="center" color="gray.500">
        N/A
      </Box>
    );
  }

  const color = getColor(value);

  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      h={"full"}
      w={"full"}
      maxH={"50px"}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        backgroundColor={color}
        color="white"
        fontWeight="bold"
        borderRadius="md"
        textAlign="center"
        h={"80%"}
        p={2}
      >
        {value}
      </Box>
    </Flex>
  );
};

export default HappinessScoreRenderer;
