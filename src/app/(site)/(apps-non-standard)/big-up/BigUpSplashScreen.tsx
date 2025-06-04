"use client";

import { Center, Flex, Image, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { keyframes } from "@emotion/react";
import { useUser } from "@/providers/UserProvider";
import { useRouter } from "next/navigation";

const logoTextFadeIn = keyframes`
  0%   { opacity: 0; transform: translatex(-2000px); }
  40%  { opacity: 0; transform: translatex(-2000px); }
  57%  { opacity: 1; transform: translatex(30px); }
  59%  { opacity: 1; transform: translatex(-10px); }
  60%  { opacity: 1; transform: translatex(0px); }
  95%  { opacity: 1; transform: translatex(0px); }
  100% { opacity: 0; transform: translatey(500px); }
`;

const iconContainerPop = keyframes`
  0%   { opacity: 0; scale(0); left: 0; }
  20%  { opacity: 1; transform: scale(2); }
  40%  { opacity: 1; transform: scale(2); left: 0; }
  56%  { opacity: 1; transform: scale(1); left: 95px; }
  57%  { opacity: 1; transform: translatex(48px); }
  59%  { opacity: 1; transform: translatex(0px); }
  95%  { opacity: 1; transform: translatey(0px) }
  100% { opacity: 1; transform: translatey(-500px) }

`;

const confettiBurst = keyframes`
  0%   { opacity: 0; transform: scale(0); }
  20%  { opacity: 0; transform: scale(0) }
  25%  { opacity: 1; transform: scale(2) }
  46%  { opacity: 1; transform: scale(1) }
  100% { opacity: 1; transform: scale(1) }
`;

const heroPop = keyframes`
  0%   { opacity: 0; transform: scale(1) translateY(100px); }
  18%  { opacity: 0; transform: scale(1) translateY(100px); }
  21%  { opacity: 0; transform: scale(1) translateY(0px); }
  23%  { opacity: 1; transform: scale(2) translateY(-30px); }
  26%  { opacity: 1; transform: scale(2) translateY(-30px); }
  30%  { opacity: 1; transform: scale(1) translateY(0px); }
  100% { opacity: 1; transform: scale(1) translateY(0px); }
`;

const iconBaseSpin = keyframes`
  0%   { transform: rotate(500deg); }
  22%  { transform: rotate(0deg); }
  100% { transform: rotate(0deg); }
`;

/* ─────────────────────────── Component ───────────────────────────── */
export const RecognitionHubSplashScreen = () => {
  const MotionImage = motion(Image);

  return (
    <Center flex={1} bg={"blue"} width={"100%"} position="relative">
      <Image
        src="/assets/splash-screens/recognition-hub/recognition-hub-logo-text.png"
        position="absolute"
        w="300px"
        h="auto"
        opacity={0}
        animation={`${logoTextFadeIn} 5s ease-in-out`}
        draggable={false}
      />

      {/* ─── Icon stack (base ▸ confetti ▸ hero) ─── */}
      <Flex
        position="relative"
        left="95px"
        top="-65px"
        w={"110px"}
        opacity={0}
        animation={`${iconContainerPop} 5s ease-out 0s`}
      >
        {/* 1️⃣  Base shadow/podium */}
        <Image
          src="/assets/splash-screens/recognition-hub/recognition-icon-base.png"
          position="absolute"
          top={0}
          w="100%"
          left={0}
          zIndex={1}
          animation={`${iconBaseSpin} 5s ease-out 0s`}
          draggable={false}
        />

        {/* 2️⃣  Confetti burst */}
        <MotionImage
          src="/assets/splash-screens/recognition-hub/recognition-icon-confetti.png"
          position="absolute"
          top={0}
          left={0}
          w="100%"
          animation={`${confettiBurst} 5s ease-out 0s`}
          style={{ transformOrigin: "50% 100%" }}
          zIndex={2}
          draggable={false}
        />

        {/* 3️⃣  “Recognised” hero figure */}
        <MotionImage
          src="/assets/splash-screens/recognition-hub/recognition-icon-recognised.png"
          position="absolute"
          top={0}
          left={0}
          w="100%"
          animation={`${heroPop} 5s ease-out 0s`}
          zIndex={3}
          draggable={false}
        />
      </Flex>
    </Center>
  );
};
