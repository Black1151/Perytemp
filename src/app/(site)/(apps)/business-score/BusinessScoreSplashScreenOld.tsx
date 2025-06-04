"use client";

import { Box, Center, Image } from "@chakra-ui/react";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

const MotionImage = motion(Image);
const MotionBox = motion(Box);

const BusinessScoreSplashScreenOld: React.FC = () => {
  const controls = useAnimation();

  const fadeInDelay = 2.3;
  const delayBeforeStart = 0.4;
  const rotationDuration = 0.6;
  const fadeOutDuration = 0.4;

  useEffect(() => {
    const animateNeedle = async () => {
      await new Promise((resolve) => setTimeout(resolve, fadeInDelay * 1000));
      await controls.start({
        opacity: 1,
        transition: { duration: 0.5 },
      });
      await new Promise((resolve) =>
        setTimeout(resolve, delayBeforeStart * 1000)
      );
      await controls.start({
        rotate: [-90, 90],
        transition: { duration: rotationDuration, ease: "easeInOut" },
      });
      await controls.start({
        opacity: 0,
        transition: { duration: fadeOutDuration },
      });
    };

    animateNeedle();
  }, [
    controls,
    fadeInDelay,
    delayBeforeStart,
    rotationDuration,
    fadeOutDuration,
  ]);

  return (
    <Center flex={1}>
      <Box position="relative" width="300px">
        <MotionImage
          src="/assets/splash-screens/business-score/PBSlogo.png"
          alt="splash-screen"
          width="300px"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1.1, 1, 1, 0.5],
            rotate: [0, 0, 0, 360],
          }}
          transition={{
            duration: 5.8,
            times: [0, 0.2, 0.8, 1],
            ease: "easeInOut",
          }}
        />
        <MotionBox
          style={{
            position: "absolute",
            left: "calc(50% - 4px)",
            top: "calc(50%)",
            width: "5px",
            height: "50px",
            backgroundColor: "red",
            transformOrigin: "bottom center",
          }}
          initial={{ rotate: -90, opacity: 0 }}
          animate={controls}
        />
      </Box>
    </Center>
  );
};

export default BusinessScoreSplashScreenOld;
