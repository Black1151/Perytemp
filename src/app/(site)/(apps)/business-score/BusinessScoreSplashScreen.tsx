"use client";

import { Box, Center, Flex, Image, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { keyframes } from "@emotion/react";

const logoTextBgAnimation = keyframes`
  0% { opacity: 0; }
  40% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 1; }
`;

const gaugeAnimation = keyframes`
  0%   { transform: rotate(-180deg); opacity: 0; }
  10%  { opacity: 1; }
  20% { transform: rotate(0deg); }
  80% { transform: rotate(0deg); }   /* settle exactly at 0° */
  100% { transform: rotate(0deg); }
`;

const dialAnimation = keyframes`
  0%   { transform: translateX(-50%) rotate(-180deg) scale(0); opacity: 0;  }
  10%  { opacity: 1; transform: translateX(-50%) rotate(0deg) scale(2)}
  50%  { transform: translateX(-50%) rotate(0deg) scale(2)}
  55%  { transform: translateX(-50%) rotate(0deg) scale(1)}
  100% { transform: translateX(-50%) rotate(0deg) scale(1); }
`;

// === Component ===
export const BusinessScoreSplashScreen = () => {
  const MotionVStack = motion(VStack);
  const MotionImage = motion(Image);

  return (
    <Center flex={1}>
      <MotionVStack
        initial={{ opacity: 1, scale: 1 }}
        animate={{ opacity: 0, scale: 0.75 }}
        transition={{ delay: 3.5, duration: 1, ease: "easeInOut" }}
        position="relative"
      >
        {/* Background text */}
        <Box minW={["300px", "400px"]} h={["120px", "160px"]}>
          <Image
            src={
              "/assets/splash-screens/business-score/business-score-logo-text.png"
            }
            position="absolute"
            top={0}
            left={0}
            w="100%"
            animation={`${logoTextBgAnimation} 5s ease-in-out`}
            minW={["300px", "400px"]}
            h={["120px", "160px"]}
          />
          {/* Dial */}
          <Flex
            position="relative"
            left="50%"
            top={"40%"}
            transform="translateX(-50%)"
            animation={`${dialAnimation} 5s ease-out 0s`}
            w={["70px", "105px"]}
            h={["70px", "105px"]}
          >
            {/* Base */}
            <Image
              src="/assets/splash-screens/business-score/base.png"
              position="absolute"
              w="100%"
              top={0}
              left={0}
              zIndex={2}
            />

            {/* Coloured gauge */}
            <MotionImage
              src="/assets/splash-screens/business-score/gauge.png"
              position="absolute"
              w="100%"
              top={0}
              left={0}
              animation={`${gaugeAnimation} 5s ease-out 0s`}
            />

            {/* Rotating needle */}
            <MotionImage
              src="/assets/splash-screens/business-score/needle.png"
              position="absolute"
              w="100%"
              top={0}
              left={0}
              initial={{ rotate: -120 }}
              animate={{ rotate: [-120, 30, 0] }}
              transition={{
                delay: 0.8,
                duration: 1,
                ease: "easeInOut",
              }}
            />

            {/* Centre disc */}
            <MotionImage
              src="/assets/splash-screens/business-score/centre.png"
              position="absolute"
              w={["50px", "70px"]}
              top="50%"
              left="50%"
              style={{ x: "-50%", y: "-50%" }}
            />
          </Flex>
        </Box>
      </MotionVStack>
    </Center>
  );
};
