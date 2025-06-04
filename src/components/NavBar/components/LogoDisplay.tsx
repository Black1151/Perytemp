// components/NavBar/LogoDisplay.tsx
import React from "react";
import { HStack, Image, Text, Badge, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { motion } from "framer-motion";

interface LogoDisplayProps {
  userRole: string;
  toolLogo?: string;
  toolPath?: string;
  userIsFree?: boolean;
  userIsExpired?: boolean;
}

// Create motion‐enhanced versions of Chakra’s Badge
const MotionBadge = motion(Badge);

const LogoDisplay: React.FC<LogoDisplayProps> = ({
  userRole,
  toolLogo,
  toolPath,
  userIsFree,
  userIsExpired,
}) => {
  const badgeVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  };

  const logoContent =
    toolLogo && toolLogo.trim() !== "" ? (
      <HStack spacing={2}>
        <Image src={toolLogo} alt="logo" height="50px" objectFit="contain" />
        <HStack spacing={0.5}>
          {userIsFree && (
            <MotionBadge
              colorScheme="green"
              h="min-content"
              fontSize={[10, 12]}
              variants={badgeVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.3 }}
            >
              TRIAL
            </MotionBadge>
          )}
          {userIsExpired && (
            <MotionBadge
              colorScheme="red"
              h="min-content"
              fontSize={[10, 12]}
              variants={badgeVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              EXPIRED
            </MotionBadge>
          )}
        </HStack>
      </HStack>
    ) : (
      <HStack spacing={2} alignItems="center" justifyContent="center">
        <Text
          fontFamily="bonfire"
          fontSize={[30, 40]}
          bgClip="text"
          color="white"
        >
          Perygon
        </Text>
        <HStack spacing={0.5}>
          {userIsFree && (
            <MotionBadge
              colorScheme="green"
              h="min-content"
              fontSize={[10, 12]}
              variants={badgeVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.65 }}
            >
              TRIAL
            </MotionBadge>
          )}
          {userIsExpired && (
            <MotionBadge
              colorScheme="red"
              h="min-content"
              fontSize={[10, 12]}
              variants={badgeVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.65, delay: 0.45 }}
            >
              EXPIRED
            </MotionBadge>
          )}
        </HStack>
      </HStack>
    );

  return userRole === "EU" ? (
    <>{logoContent}</>
  ) : (
    <Link href={toolPath || "/"}>{logoContent}</Link>
  );
};

export default LogoDisplay;
