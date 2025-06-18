"use client";
import { Box, VStack, Text, Image } from "@chakra-ui/react";
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
  return (
    <Box
      position="relative"
      cursor={onClick ? "pointer" : undefined}
      onClick={onClick}
      h="100%"
      transition="transform 0.3s, box-shadow 0.3s"
      _hover={{ transform: "scale(1.03)", boxShadow: "2xl" }}
    >
      <PerygonCard
        width="100%"
        height="100%"
        p={4}
        display="flex"
        flexDirection="column"
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
          <Text fontWeight="bold">{item.name}</Text>
          {item.description && <Text fontSize="sm">{item.description}</Text>}
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
