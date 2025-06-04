"use client";

import LoadingBar from "@/components/LoadingBar/LoadingBar";
import { Center, VStack, Text } from "@chakra-ui/react";

export const HospitalityHubSplashScreen = () => {
  return (
    <Center flex={1}>
      <VStack spacing={4}>
        <Text fontSize="3xl" fontWeight="bold">
          Hospitality Hub
        </Text>
        <LoadingBar />
      </VStack>
    </Center>
  );
};
