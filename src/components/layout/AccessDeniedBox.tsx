"use client";

import React from "react";
import { Box, Button, Center, Code, Text, useTheme, VStack } from "@chakra-ui/react";
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
  deniedPath,
  userAccessControlMetadata,
}: {
  buttonText: string;
  supportingText: string;
  onButtonClick?: () => void;
  buttonLink?: string;
  deniedPath?: string;
  userAccessControlMetadata?: any;
}) => {
  const theme = useTheme();
  return (
    <Center flex={1} h="100vh" position="relative" overflow="hidden" bg={theme.colors.seduloRed}>
      <SpringScale>
        <VStack
          bg="white"
          p={10}
          borderRadius="3xl"
          boxShadow="2xl"
          spacing={10}
          align="center"
          justify="center"
          maxW="2xl"
          mx="auto"
        >
          <Box position="relative" textAlign="center">
            <LetterFlyIn color="primary" fontSize={68}>Access Denied...</LetterFlyIn>
            <Text
              fontSize={{ base: "xl", md: "2xl" }}
              fontWeight="bold"
              mt={-2}
              color="gray.700"
              textShadow="1px 1px 2px rgba(0,0,0,0.2)"  
            >
              Oops! You can't access this.
            </Text>
          </Box>

          <Text fontSize="lg" textAlign="center" color="gray.500" maxW="md">
            {supportingText}
          </Text>

          {/* Show Denied Path */}
          {deniedPath && (
            <Text fontSize="md" color="gray.600">
              <strong>Denied Path:</strong> <Code>{deniedPath}</Code>
            </Text>
          )}

          {/* Show Metadata */}
          {deniedPath && (
            <Text fontSize="md" color="gray.600">
              <strong>User UUID:</strong> <Code>{userAccessControlMetadata}</Code>
            </Text>
          )}

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
    </Center>
  );
};

export default ErrorBox;
