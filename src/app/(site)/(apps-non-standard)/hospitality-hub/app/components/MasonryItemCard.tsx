"use client";
import { Box, Text, Image } from "@chakra-ui/react";
import { HospitalityItem } from "@/types/hospitalityHub";
import PerygonCard from "@/components/layout/PerygonCard";

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
    <PerygonCard
      position="relative"
      borderRadius="lg"
      h="100%"
      cursor={onClick ? "pointer" : undefined}
      onClick={onClick}
      overflow="hidden"
      transition="transform 0.3s, box-shadow 0.3s"
      _hover={{ transform: "scale(1.03)", boxShadow: "3xl" }}
      p={0}
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
        display="flex"
        flexDirection="column"
        justifyContent="flex-end"
        bottom={0}
        left={0}
        w="100%"
        p={8}
        h="50%"
        bgGradient="linear(to-t, rgba(0,0,0,0.9), rgba(0,0,0,0))"
      >
        <Text
          color="white"
          fontWeight="bold"
          fontSize={["lg", "2xl", null, null, null, "4xl"]}
          fontFamily="metropolis"
        >
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
    </PerygonCard>
  );
}
