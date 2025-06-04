// pages/register-company/success.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Flex,
  VStack,
  Text,
  Button,
  Spinner,
  useTheme,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useUser } from "@/providers/UserProvider";
import LogoUpload from "../LogoUpload";
import ConfettiAlt from "@/components/animations/confetti/ConfettiAlt";
import { Check } from "@mui/icons-material";

interface RegisterSuccessProps {
  initialCustomerData: any;
}

export default function RegisterSuccess({
  initialCustomerData,
}: RegisterSuccessProps) {
  const { user } = useUser();
  const router = useRouter();
  const theme = useTheme();

  // track that we’ve done our one-time refresh
  const [didRefresh, setDidRefresh] = useState(false);

  // local state for your existing UI
  const [customerData, setCustomerData] =
    useState<any>(initialCustomerData);
  const [hasLogo, setHasLogo] = useState(
    Boolean(initialCustomerData?.custImageUrl)
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // run a one‐time router.refresh() as soon as we mount to show the nav and footer.
  useEffect(() => {
    if (!didRefresh) {
      setDidRefresh(true);
      router.refresh();
    }
  }, [didRefresh, router]);

  if (!didRefresh) {
    return null;
  }

  if (loading) {
    return (
      <Flex minH="100vh" align="center" justify="center">
        <Spinner size="xl" color="white" />
      </Flex>
    );
  }

  if (error || !customerData) {
    return (
      <Flex minH="100vh" align="center" justify="center">
        <Text color="red.300">{error ?? "Unknown error"}</Text>
      </Flex>
    );
  }

  return (
    <VStack minH="100vh" w="full" p={4} spacing={8}>
      <Flex
        direction="column"
        align="center"
        justify="center"
        gap={8}
        textAlign="center"
        flex={1}
      >
        <ConfettiAlt show={didRefresh} />
        <VStack spacing={1}>
          <Text fontFamily="bonfire" fontSize="4xl" color="white">
            Your company has been registered successfully!
          </Text>
          <Text
            fontFamily="bonfire"
            fontSize="2xl"
            fontWeight="light"
            color="white"
          >
            We’re so excited to have you on board 🎉
          </Text>
        </VStack>

        <Text color="white" fontSize="lg">
          Last Step… Upload your company logo (optional)
        </Text>
        <LogoUpload
          onUploadComplete={(url: string) => {
            setHasLogo(true);
            setCustomerData((prev: any) => ({
              ...prev,
              custImageUrl: url,
            }));
          }}
        />

        <Button
          size="lg"
          bg={theme.colors.seduloGreen}
          _hover={{ bg: theme.colors.seduloGreenDark }}
          color="white"
          rightIcon={<Check />}
          onClick={() => router.push("/tool-store")}
        >
          Finish
        </Button>
      </Flex>
    </VStack>
  );
}
