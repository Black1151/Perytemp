import React from "react";
import { Flex, Text, VStack } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
// Define the pulsing animation using Chakra UI's keyframes utility
const pulse = keyframes`
    0% {
        transform: scale(1);
        opacity: 1;
    }
    50% {
        transform: scale(1.2);
        opacity: 0.8;
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
`;

const LoadingOverlay: React.FC = () => {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      width="full"
      height="full"
      py={20}
      px={5}
    >
      <VStack spacing={4}>
        {/* The pulsing letter "P" */}
        <Text
          fontSize="6xl" // Size of the "P"
          fontFamily="bonfire" // Using the Bonfire font
          color="primary" // Use the theme color for the letter
          animation={`${pulse} 1.5s infinite`} // Apply the pulsing animation
        >
          P
        </Text>
        <Text
          fontSize="2xl"
          fontWeight="bold"
          color="primary"
          fontFamily="heading"
        >
          Loading...
        </Text>
        <Text
          fontSize="lg"
          color="primary"
          textAlign="center"
          fontFamily="body"
        >
          Please wait while we fetch the data.
        </Text>
      </VStack>
    </Flex>
  );
};

export default LoadingOverlay;
