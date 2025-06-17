"use client";
import { Box, Text, Image } from "@chakra-ui/react";
import { HospitalityItem } from "@/types/hospitalityHub";

export interface MasonryItemCardProps {
  item: HospitalityItem;
  onClick?: () => void;
  disabled?: boolean;
}

export default function MasonryItemCard({
  item,
  onClick,
  disabled = false,
}: MasonryItemCardProps) {
  return (
    <Box
      position="relative"
      cursor={onClick ? "pointer" : undefined}
      onClick={onClick}
      h="100%"
      borderRadius="lg"
      overflow="hidden"
      transition="transform 0.3s, box-shadow 0.3s"
      _hover={{ transform: "scale(1.05)", boxShadow: "2xl" }}
    >
      {(item.coverImageUrl || item.logoImageUrl) && (
        <Image
          src={item.coverImageUrl || item.logoImageUrl}
          alt={item.name}
          objectFit="cover"
          w="100%"
          h="100%"
        />
      )}
      <Box
        position="absolute"
        bottom={0}
        left={0}
        w="100%"
        p={4}
        bgGradient="linear(to-t, rgba(0,0,0,0.7), rgba(0,0,0,0))"
      >
        <Text color="white" fontWeight="bold">
          {item.name}
        </Text>
        {item.description && (
          <Text color="white" fontSize="sm">
            {item.description}
          </Text>
        )}
      </Box>
      {disabled && (
        <Box
          position="absolute"
          top={0}
          left={0}
          w="100%"
          h="100%"
          bg="rgba(128,128,128,0.5)"
          pointerEvents="none"
        />
      )}
    </Box>
  );
}
