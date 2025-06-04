import React from "react";
import { Flex, Icon, Text, VStack } from "@chakra-ui/react";
import { QueryStats } from "@mui/icons-material";

interface NoDataOverlayProps {
  gridType: "population" | "sample"; // Define the possible grid types
}

const NoDataOverlay: React.FC<NoDataOverlayProps> = ({ gridType }) => {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      py={20}
      px={5}
      width="100%"
      height="100%"
      borderRadius="md"
    >
      <VStack spacing={4}>
        <Icon as={QueryStats} boxSize={20} color="white" />
        <Text
          fontSize="2xl"
          fontWeight="bold"
          color="white"
          fontFamily="heading"
        >
          {gridType === "population" ? "No data" : "No data"}
        </Text>
        <Text fontSize="lg" color="white" textAlign="center" fontFamily="body">
          {gridType === "population" ? "" : "Add items to this grid"}
        </Text>
      </VStack>
    </Flex>
  );
};

export default NoDataOverlay;
