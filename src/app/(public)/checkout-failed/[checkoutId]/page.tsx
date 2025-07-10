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
import { useRouter } from "next/navigation";

interface PageProps {
  params: { checkoutId: string };
}

export default function Page({ params }: PageProps) {
  const theme = useTheme();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const router = useRouter();

  return (
    <Center minH="100vh" bg={theme.colors.primary}>
      <Box bg={"white"} p={8} rounded="lg" shadow="md" maxW="md" w="100%">
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
      </Box>
    </Center>
  );
}
