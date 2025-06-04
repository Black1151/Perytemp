"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Spinner,
  Center,
  VStack,
  useTheme,
  useToast,
  Button,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation"
import ConfettiAlt from "@/components/animations/confetti/ConfettiAlt";

interface PageProps {
  params: { checkoutId: string };
}

export default function Page({ params }: PageProps) {
  const theme = useTheme();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const router = useRouter()

  const handleCheckout = async () => {
    setLoading(true);
    setError(false);

    const payload = {
      id: params.checkoutId,
    };

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to create basket.");
      }

      // Optionally, you can show a success toast or redirect here
    } catch (error) {
      setError(true);
      toast({
        title: "Checkout Failed",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleCheckout();
  }, []);

  return (
    <Center minH="100vh" bg={theme.colors.primary}>
      <Box bg={"white"} p={8} rounded="lg" shadow="md" maxW="md" w="100%">
        {loading ? (
          <VStack spacing={6}>
            <Spinner size="xl" color={theme.colors.primary} />
            <Heading
              size="2xl"
              color={theme.colors.primary}
              textAlign="center"
              fontFamily="bonfire"
              fontWeight="normal"
            >
              Finalising your subscription...
            </Heading>
            <Text color={theme.colors.primaryTextColor} textAlign="center">
              Please wait while we process your payment and set up your
              subscription. This may take a few moments.
            </Text>
            <Text color={theme.colors.secondaryTextColor} fontSize="sm">
              Checkout ID: {params.checkoutId}
            </Text>
          </VStack>
        ) : error ? (
          <VStack spacing={6}>
            <Heading
              size="2xl"
              color={theme.colors.primary}
              textAlign="center"
              fontFamily="bonfire"
              fontWeight="normal"
            >
              Something went wrong
            </Heading>
            <Text color="gray.600" textAlign="center">
              We were unable to process your subscription. Please try again or
              contact support.
            </Text>
            <Text color="gray.500" fontSize="sm">
              Checkout ID: {params.checkoutId}
            </Text>
          </VStack>
        ) : (
          <VStack spacing={6}>
            <Heading
              size="2xl"
              color={theme.colors.primary}
              textAlign="center"
              fontFamily="bonfire"
              fontWeight="normal"
            >
              Subscription Activated!
            </Heading>
            <Text color="gray.600" textAlign="center">
              Your payment was successful and your subscription is now active.
            </Text>
            <Text color="gray.500" fontSize="sm">
              Checkout ID: {params.checkoutId}
            </Text>
            <Button onClick={() => router.push("/tool-store/my-subscription")}>Finish</Button>
            <ConfettiAlt show={!error && !loading}/>
          </VStack>
        )}
      </Box>
    </Center>
  );
}
