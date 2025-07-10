// components/NavBar/LogoDisplay.tsx
import React from "react";
import { HStack, Image, Text, Badge, Stack } from "@chakra-ui/react";
import Link from "next/link";
import { motion } from "framer-motion";

interface LogoDisplayProps {
  userRole: string;
  toolLogo?: string;
  toolPath?: string;
  userIsFree?: boolean;
  isFreeUntil?: string;
}

function daysLeft(freeUntil: string): number {
  const [year, month, day] = freeUntil.split("-").map(Number);
  const endDate = new Date(Date.UTC(year, month - 1, day));

  const now = new Date();
  const todayUTC = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );

  const msPerDay = 1000 * 60 * 60 * 24;
  const diffMs = endDate.getTime() - todayUTC.getTime();
  return Math.ceil(diffMs / msPerDay);
}

// Create motion‐enhanced versions of Chakra’s Badge
const MotionBadge = motion(Badge);

const LogoDisplay: React.FC<LogoDisplayProps> = ({
  userRole,
  toolLogo,
  toolPath,
  userIsFree,
  isFreeUntil,
}) => {
  const badgeVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  };

  const amountDays = isFreeUntil ? daysLeft(isFreeUntil) : undefined;

  const logoContent =
    toolLogo && toolLogo.trim() !== "" ? (
      <HStack spacing={2}>
        <Image src={toolLogo} alt="logo" height="50px" objectFit="contain" />
        {userIsFree && (
          <Stack flexDirection={["column", "row", "row"]} spacing={0.5}>
            <MotionBadge
              colorScheme="green"
              h="min-content"
              w="min-content"
              fontSize={[10, 12]}
              variants={badgeVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.3 }}
            >
              TRIAL
            </MotionBadge>
            {typeof amountDays === "number" && amountDays <= 0 ? (
              <MotionBadge
                colorScheme="red"
                h="min-content"
                w="min-content"
                fontSize={[10, 12]}
                variants={badgeVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                EXPIRED
              </MotionBadge>
            ) : typeof amountDays === "number" && amountDays > 0 ? (
              <MotionBadge
                colorScheme="teal"
                h="min-content"
                w="min-content"
                fontSize={[10, 12]}
                variants={badgeVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                {amountDays} DAY{amountDays !== 1 ? "S" : ""} LEFT
              </MotionBadge>
            ) : null}
          </Stack>
        )}
      </HStack>
    ) : (
      <HStack spacing={2} alignItems="center" justifyContent="center">
        <Text
          fontFamily="bonfire"
          fontSize={[30, 40]}
          bgClip="text"
          color="white"
          mb={-2.5}
        >
          Perygon
        </Text>
        {userIsFree && (
          <Stack flexDirection={["column", "row", "row"]} spacing={0.5}>
            <MotionBadge
              colorScheme="green"
              h="min-content"
              w="min-content"
              fontSize={[10, 12]}
              variants={badgeVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.65 }}
            >
              TRIAL
            </MotionBadge>
            {typeof amountDays === "number" && amountDays <= 0 ? (
              <MotionBadge
                colorScheme="red"
                h="min-content"
                w="min-content"
                fontSize={[10, 12]}
                variants={badgeVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                EXPIRED
              </MotionBadge>
            ) : typeof amountDays === "number" && amountDays > 0 ? (
              <MotionBadge
                colorScheme="cyan"
                h="min-content"
                w="min-content"
                fontSize={[10, 12]}
                variants={badgeVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                {amountDays} DAY{amountDays !== 1 ? "S" : ""} LEFT
              </MotionBadge>
            ) : null}
          </Stack>
        )}
      </HStack>
    );

  return userRole === "EU" ? (
    <>{logoContent}</>
  ) : (
    <Link href={toolPath || "/"}>{logoContent}</Link>
  );
};

export default LogoDisplay;
