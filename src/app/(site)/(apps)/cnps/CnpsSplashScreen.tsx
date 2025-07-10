"use client";

import LoadingBar from "@/components/LoadingBar/LoadingBar";
import { Box, Center, Flex, Image, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { keyframes } from "@emotion/react";

const swirlIn = keyframes`
  0% {
    transform: scale(0) rotate(0deg);
    opacity: 0;
  }
  100% {
    transform: scale(1) rotate(720deg);
    opacity: 1;
  }
`;

const bounceSpin = keyframes`
  0% {
    transform: translateY(0) scale(1) rotate(0deg);
  }
  30% {
    transform: translateY(-30px) scale(1.25) rotate(0deg);
  }
  50% {
    transform: translateY(-30px) scale(1.25) rotate(360deg);
  }
  70% {
    transform: translateY(-30px) scale(1.25) rotate(360deg);
  }
  100% {
    transform: translateY(0) scale(1) rotate(0deg);
  }
`;

const fadeScaleOut = {
  opacity: 0,
  scale: 0.75,
};

export const CnpsSplashScreen = () => {
  const MotionVStack = motion(VStack);

  return (
    <Center flex={1}>
      <MotionVStack
        initial={{ opacity: 1, scale: 1 }}
        animate={fadeScaleOut}
        transition={{ delay: 3.5, duration: 1, ease: "easeInOut" }}
        position="relative"
      >
        <Box
          bgImage="url('/assets/splash-screens/enps-score/enps-logo-text.png')"
          bgSize="contain"
          bgRepeat="no-repeat"
          bgPosition="center"
          w="300px"
          h="100px"
          animation={`${swirlIn} 1.2s ease-in-out`}
        >
          <Flex position="relative" left="35px" top="7px" w="48px">
            <Box
              animation={`${bounceSpin} 2s ease-in-out 1.2s`}
              position="absolute"
              w="50px"
              left={110}
              top={-2}
            >
              <Image src="/assets/splash-screens/enps-score/enps-logo.webp" />
            </Box>
          </Flex>
        </Box>
        <LoadingBar />
      </MotionVStack>
    </Center>
  );
};
