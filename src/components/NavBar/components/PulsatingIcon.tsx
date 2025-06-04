// components/NavBar/PulsatingIcon.tsx
import React from "react";
import { Box } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

export interface PulsatingIconProps {
  icon: React.ReactNode;
  bgColor?: string;
  borderColor?: string;
  size?: number | number[];
}

const PulsatingIcon: React.FC<PulsatingIconProps> = ({
  icon,
  bgColor = "red",
  borderColor = "white",
  size = 20,
}) => {
  return (
    <MotionBox
      position="absolute"
      bottom={-1}
      right={-2}
      bg={bgColor}
      borderRadius="full"
      width={`${size}px`}
      height={`${size}px`}
      display="flex"
      alignItems="center"
      justifyContent="center"
      border={`1px solid ${borderColor}`}
      animate={{ scale: [1, 1.3, 1] }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {icon}
    </MotionBox>
  );
};

export default PulsatingIcon;
