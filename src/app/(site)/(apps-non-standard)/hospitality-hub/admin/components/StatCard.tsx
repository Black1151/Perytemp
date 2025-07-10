// ─────────────────────────────────────────────────────────────
// components/cards/StatCard.tsx
// ─────────────────────────────────────────────────────────────
"use client";

import { Box, Flex, Text, useTheme } from "@chakra-ui/react";
import { transparentize } from "polished";
import { ReactNode } from "react";
import PerygonCard from "@/components/layout/PerygonCard";

/**
 * Generic stat card with EngagementCard styling but open body.
 *
 * @param icon         Icon shown top-right (ghost + optional full-size)
 * @param title        Small label displayed above body (optional)
 * @param color        Accent colour – drives tint + icon colour
 * @param overlayAlpha How translucent the tint is (0 – 1). Defaults 0.85
 * @param children     Custom body content (count, £, %, stacks…)
 */
export interface StatCardProps {
  icon?: ReactNode;
  title?: string;
  color?: string;
  overlayAlpha?: number;
  children: ReactNode;
}

const StatCard = ({
  icon,
  title,
  color,
  overlayAlpha = 0.85,
  children,
}: StatCardProps) => {
  const theme = useTheme();
  const accent = color ?? theme.colors.blue[500];
  const translucentBg = transparentize(overlayAlpha, accent);

  return (
    <PerygonCard
      flex="1"
      bg={theme.colors.elementBG}
      position="relative"
      overflow="hidden"
    >
      {/* tinted overlay */}
      <Box position="absolute" inset={0} bg={translucentBg} zIndex={0} />

      {/* ghost icon in corner */}
      {icon && (
        <Box
          position="absolute"
          top={0}
          right={0}
          fontSize="7xl"
          opacity={0.15}
          zIndex={1}
          color={accent}
          pr={2}
        >
          {icon}
        </Box>
      )}

      {/* main content */}
      <Flex
        direction="column"
        position="relative"
        zIndex={2}
        align="left"
        textAlign="left"
      >
        {title && (
          <Text
            fontSize="xl"
            fontWeight="semibold"
            mb={2}
            textColor={theme.colors.primaryTextColor}
          >
            {title}
          </Text>
        )}

        {children}
      </Flex>
    </PerygonCard>
  );
};

export default StatCard;
