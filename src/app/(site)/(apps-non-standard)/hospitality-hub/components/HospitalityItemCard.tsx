"use client";
import { Box, VStack, Text, Image, useTheme } from "@chakra-ui/react";
import { transparentize } from "@chakra-ui/theme-tools";
import PerygonCard from "@/components/layout/PerygonCard";
import { HospitalityItem } from "@/types/hospitalityHub";

export interface HospitalityItemCardProps {
  item: HospitalityItem;
  onClick?: () => void;
  disabled?: boolean;
}

export default function HospitalityItemCard({
  item,
  onClick,
  disabled = false,
}: HospitalityItemCardProps) {
  const theme = useTheme();
  return (
    <Box
      position="relative"
      cursor={onClick ? "pointer" : undefined}
      onClick={onClick}
      h="100%"
    >
      <PerygonCard
        width="100%"
        height="100%"
        p={4}
        display="flex"
        flexDirection="column"
        bg={transparentize(theme.colors.elementBG, 0.2)(theme)}
        border="1px solid"
        borderColor={transparentize(theme.colors.elementBG, 0.4)(theme)}
      >
        {(item.coverImageUrl || item.logoImageUrl) && (
          <Image
            src={item.coverImageUrl || item.logoImageUrl}
            alt={item.name}
            borderRadius="md"
            mb={2}
          />
        )}
        <VStack align="start" spacing={1} flex={1}>
          <Text
            fontWeight="bold"
            color={theme.colors.elementBG}
            fontSize="lg"
            noOfLines={1}
          >
            {item.name}
          </Text>
          {item.description && (
            <Text fontSize="sm" color={theme.colors.elementBG} noOfLines={2}>
              {item.description}
            </Text>
          )}
        </VStack>
      </PerygonCard>
      {disabled && (
        <Box
          position="absolute"
          top={0}
          left={0}
          w="100%"
          h="100%"
          bg="rgba(128,128,128,0.5)"
          borderRadius="inherit"
          pointerEvents="none"
        />
      )}
    </Box>
  );
}
