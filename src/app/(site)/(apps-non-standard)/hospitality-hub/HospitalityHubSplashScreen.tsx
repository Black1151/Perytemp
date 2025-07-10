"use client";

import { Center, Flex, Image } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { keyframes } from "@emotion/react";

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
  0%   { opacity:  0; transform: scale(0); }
  20%  { opacity: 0; transform: scale(0) }
  25%  { opacity: 1; transform: scale(3) }
  46%  { opacity: 1; transform: scale(1.3) }
  100% { opacity: 1; transform: scale(1.3) }
`;

const lidPop = keyframes`
  0%   {  transform: scale(2) translateY(0px); }
  18%  {  transform: scale(2) translateY(0px); }
  21%  {  transform: scale(2) translateY(0px); }
  30%  {  transform: scale(2) translateY(-100px) rotate(360deg); }

  35%  {  transform: scale(1.3) translateY(0px) translateX(0px) rotate(0deg); }
  100% {  transform: scale(1.3) translateY(0px) translateX(0px) rotate(0deg); }

`;

const iconBaseSpin = keyframes`
  0%   { transform: scale(2); }
  40%  { transform: scale(2); }
  45%  { transform: scale(1.3); }
  100% { transform: scale(1.3); }
`;

/* ─────────────────────────── Component ───────────────────────────── */
export const HospitalityHubSplashScreen = () => {
  const MotionImage = motion(Image);

  return (
    <Center flex={1} bg={"blue"} width={"100%"} position="relative">
      <Image
        src="/assets/splash-screens/hospitality-hub/hospitality-hub-logo-text.png"
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
          src="/assets/splash-screens/hospitality-hub/hospitality-hub-logo-box.png"
          position="absolute"
          top={0}
          w="100%"
          left={0}
          // zIndex={1}
          animation={`${iconBaseSpin} 5s ease-out 0s`}
          draggable={false}
        />

        {/* 2️⃣  Confetti burst */}
        <MotionImage
          src="/assets/splash-screens/hospitality-hub/hospitality-hub-logo-confetti.png"
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
          src="/assets/splash-screens/hospitality-hub/hospitality-hub-logo-lid.png"
          position="absolute"
          top={0}
          left={0}
          w="100%"
          animation={`${lidPop} 5s ease-out 0s`}
          zIndex={3}
          draggable={false}
        />
      </Flex>
    </Center>
  );
};
