"use client";

import { Box, Button, Center, Code, Text, VStack, useTheme, Badge } from "@chakra-ui/react";
import { SpringScale } from "@/components/animations/SpringScale";
import { LetterFlyIn } from "@/components/animations/text/LetterFlyIn";
import { useRouter } from "next/navigation";
import { ExitToApp } from "@mui/icons-material";

export default function TrialExpiredPage() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <Center flex={1} h="100vh" position="relative" overflow="hidden" bg={theme.colors.seduloRed}>
      <SpringScale>
        <VStack
          bg="white"
          p={10}
          borderRadius="3xl"
          boxShadow="2xl"
          spacing={8}
          align="center"
          justify="center"
          maxW="2xl"
          mx="auto"
        >
          <Box position="relative" textAlign="center">
            <Badge colorScheme="red" mb={6} p={1}>Trial Expired</Badge>
            <LetterFlyIn color={theme.colors.primary} fontSize={68}>
              Perygon Trial Expired
            </LetterFlyIn>
            <Text
              fontSize={{ base: "xl", md: "2xl" }}
              fontWeight="bold"
              mt={2}
              color="gray.700"
              textShadow="1px 1px 2px rgba(0,0,0,0.2)"
            >
              Your access has ended...
            </Text>
          </Box>

          <Text fontSize="lg" textAlign="center" color="gray.500" maxW="md">
            Your trial period has expired. Please contact your admin team for further assistance or to renew your access.
          </Text>
          <Button onClick={() => router.push("/logout")} rightIcon={<ExitToApp/>}>
            Finish
          </Button>
        </VStack>
      </SpringScale>
    </Center>
  );
}
