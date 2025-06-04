"use client";

import LoadingBar from "@/components/LoadingBar/LoadingBar";
import { Box, Center, Flex, Image, VStack } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { motion } from "framer-motion";

const fadeIn = keyframes`
    0% {
        opacity: 0;
        transform: rotate(0deg);
    }
    100% {
        opacity: 1;
        transform: rotate(360deg);
    }
`;

const fadeOut = keyframes`
    0% {
        opacity: 1;
        transform: rotate(0deg);
    }
    100% {
        opacity: 0;
        transform: rotate(-360deg);
    }
`;

const enlargeRotate = keyframes`
    0% {
        transform: scale(0) rotate(360deg);
    }
    100% {
        transform: scale(1) rotate(0deg);
    }
`;

const pulsate = keyframes`
    0% {
        transform: scale(1) rotate(0);
    }
    25% {
        transform: scale(1.25) rotate(25deg);
    }
    50% {
        transform: scale(1.5) rotate(-25deg);
    }
    100% {
        transform: scale(1) rotate(0);
    }
`;

export const HappinessScoreSplashScreen = () => {
  const MotionVStack = motion(VStack);
  return (
    <Center flex={1}>
      <MotionVStack
        initial={{ opacity: 1, rotate: 0 }}
        animate={{ opacity: 0, rotate: -1080 }}
        transition={{ delay: 3.5, duration: 1, ease: "easeInOut" }}
      >
        <Box
          bgImage="url('/assets/splash-screens/happiness-score/happiness-score-logo-text.png')"
          bgSize="contain"
          bgRepeat="no-repeat"
          bgPosition="center"
          w="300px"
          h="100px"
          animation={`${fadeIn} 1s ease-in-out`}
        >
          <Flex
            position="relative"
            left="23px"
            top="5px"
            animation={`${enlargeRotate} 1.2s ease-in-out`}
            transformOrigin="center"
            w={"70px"}
          >
            <Box animation={`${pulsate} 2s ease-in-out 1.2s`}>
              <Image src="/assets/splash-screens/happiness-score/logoFace.webp" />
            </Box>
          </Flex>
        </Box>
        <LoadingBar />
      </MotionVStack>
    </Center>
  );
};
