"use client";

import { Center, VStack, Flex, Link, Image } from "@chakra-ui/react";
import { PerygonContainer } from "@/components/layout/PerygonContainer";
import { LoginCard } from "@/components/login/LoginCard";
import dynamic from "next/dynamic";
import { LetterFlyIn } from "@/components/animations/text/LetterFlyIn";
import { useEffect, useState, Suspense } from "react";
import SignUpCard, { Action } from "@/components/login/SignUpCard";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Select,
  Stack,
  Spinner,
} from "@chakra-ui/react";
import { useTheme } from "@chakra-ui/react";

const SignUpPageClient = dynamic(() => import("./SignUpPageClient"), {
  ssr: false,
});

export default function SignUpPage() {
  const [title, setTitle] = useState("Sign up");
  const [description, setDescription] = useState("");
  const theme = useTheme();

  return (
    <Flex
      minH="100vh"
      bg="gray.100"
      align="center"
      justify="center"
      p={4}
      bgGradient={theme.gradients.primaryGradient}
    >
      <SignUpCard>
        <Suspense
          fallback={
            <Center h="200px">
              <Spinner size="xl" />
            </Center>
          }
        >
          <Box width="full" maxW="md">
            <SignUpPageClient />
          </Box>
        </Suspense>
      </SignUpCard>
    </Flex>
  );
}
