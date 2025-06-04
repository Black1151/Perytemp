"use client";

import React from "react";
import { Box, Button, Center, Text, VStack } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { SpringScale } from "@/components/animations/SpringScale";
import { LetterFlyIn } from "@/components/animations/text/LetterFlyIn";
import Link from "next/link";

const floatingAnimation = keyframes`
    0% {
        transform: translateY(0px);
    }
    50% {
        transform: translateY(-10px);
    }
    100% {
        transform: translateY(0px);
    }
`;

const ErrorBox = ({
  buttonText,
  supportingText,
  onButtonClick,
  buttonLink,
}: {
  buttonText: string;
  supportingText: string;
  onButtonClick?: () => void;
  buttonLink?: string;
}) => {
  return (
    <Center flex={1} h="100vh" position="relative" overflow="hidden">
      <Box
        position="absolute"
        top="0"
        left="0"
        w="100%"
        h="100%"
        zIndex={-1}
        animation={`${floatingAnimation} 6s ease-in-out infinite`}
      />

      <SpringScale>
        <VStack
          bg="white"
          p={10}
          borderRadius="3xl"
          boxShadow="2xl"
          spacing={10}
          align="center"
          justify="center"
          maxW="lg"
          mx="auto"
        >
          {/* 404 Error text with animated effect */}
          <Box position="relative" textAlign="center">
            <LetterFlyIn color="primary">Error...</LetterFlyIn>
            <Text
              fontSize={{ base: "xl", md: "2xl" }}
              fontWeight="bold"
              mt={-2}
              color="gray.700"
              textShadow="1px 1px 2px rgba(0,0,0,0.2)"
            >
              Oops! An error has occurred.
            </Text>
          </Box>
          {/* Supporting text */}
          <Text fontSize="lg" textAlign="center" color="gray.500" maxW="md">
            {supportingText}
          </Text>
          {/* Button with smooth animation */}
          {buttonLink ? (
            <Link href={buttonLink} passHref>
              <Button
                variant="solid"
                size="lg"
                bg="primary"
                color="white"
                _hover={{ bg: "primary", transform: "scale(1.05)" }}
                _active={{ bg: "primary" }}
                transition="all 0.3s ease"
                boxShadow="lg"
              >
                {buttonText}
              </Button>
            </Link>
          ) : (
            <Button
              variant="solid"
              size="lg"
              bg="primary"
              color="white"
              _hover={{ bg: "primary", transform: "scale(1.05)" }}
              _active={{ bg: "primary" }}
              transition="all 0.3s ease"
              boxShadow="lg"
              onClick={onButtonClick}
            >
              {buttonText}
            </Button>
          )}
        </VStack>
      </SpringScale>

      {/* Decorative floating elements */}
      <Box
        position="absolute"
        bottom="20%"
        right="10%"
        boxSize="200px"
        bg="rgba(255, 0, 112, 0.1)"
        borderRadius="full"
        zIndex={-1}
        animation={`${floatingAnimation} 8s ease-in-out infinite`}
      />
      <Box
        position="absolute"
        top="10%"
        left="10%"
        boxSize="300px"
        bg="rgba(144, 224, 239, 0.1)"
        borderRadius="full"
        zIndex={-1}
        animation={`${floatingAnimation} 12s ease-in-out infinite`}
      />
    </Center>
  );
};

export default ErrorBox;
