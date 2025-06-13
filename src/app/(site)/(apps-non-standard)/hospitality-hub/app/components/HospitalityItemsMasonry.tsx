"use client";

import { Box, SimpleGrid } from "@chakra-ui/react";
import { AnimatedList, AnimatedListItem } from "@/components/animations/AnimatedList";
import HospitalityItemCard from "../../components/HospitalityItemCard";
import { HospitalityItem } from "@/types/hospitalityHub";

interface HospitalityItemsMasonryProps {
  items: HospitalityItem[];
  optionalFields?: string[];
  onItemClick?: (item: HospitalityItem) => void;
}

export default function HospitalityItemsMasonry({
  items,
  optionalFields = [],
  onItemClick,
}: HospitalityItemsMasonryProps) {
  return (
    <SimpleGrid columns={[1, 2, 3]} gap={4} w="100%">
      <AnimatedList>
        {items.map((item, index) => (
          <AnimatedListItem key={item.id} index={index}>
            <Box position="relative">
              <HospitalityItemCard
                item={item}
                optionalFields={optionalFields}
                showOverlay
                onClick={() => onItemClick?.(item)}
              />
            </Box>
          </AnimatedListItem>
        ))}
      </AnimatedList>
    </SimpleGrid>
  );
}
