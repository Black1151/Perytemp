"use client";
import { Box, VStack, Text, Image } from "@chakra-ui/react";
import PerygonCard from "@/components/layout/PerygonCard";
import { HospitalityItem } from '@/types/hospitalityHub';

export interface HospitalityItemCardProps {
  item: HospitalityItem;
  optionalFields?: string[];
  onClick?: () => void;
  showOverlay?: boolean;
}

function formatLabel(label: string) {
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export default function HospitalityItemCard({
  item,
  optionalFields = [],
  onClick,
  showOverlay,
}: HospitalityItemCardProps) {
  return (
    <Box
      position="relative"
      role={showOverlay ? "group" : undefined}
      cursor={onClick ? "pointer" : undefined}
      onClick={onClick}
      h="100%"
    >
      <PerygonCard width="100%" height="100%" p={4} display="flex" flexDirection="column">
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
          {optionalFields.map((field) =>
            item[field] ? (
              <Text key={field} fontSize="sm">
                {formatLabel(field)}: {String(item[field])}
              </Text>
            ) : null,
          )}
        </VStack>
      </PerygonCard>
      {showOverlay && (
        <Box
          position="absolute"
          top={0}
          left={0}
          w="100%"
          h="100%"
          bg="rgba(0,0,0,0.6)"
          display="flex"
          justifyContent="center"
          alignItems="center"
          opacity={0}
          transition="opacity 0.3s"
          _groupHover={{ opacity: 1 }}
        >
          <Text color="white" fontWeight="bold" fontSize="xl">
            {item.name}
          </Text>
        </Box>
      )}
    </Box>
  );
}
