"use client";

import { SimpleGrid } from "@chakra-ui/react";
import HospitalityItemCard from "../../components/HospitalityItemCard";
import { HospitalityItem } from "@/types/hospitalityHub";

interface HospitalityItemsMasonryProps {
  items: HospitalityItem[];
  optionalFields?: string[];
}

export default function HospitalityItemsMasonry({
  items,
  optionalFields = [],
}: HospitalityItemsMasonryProps) {
  return (
    <SimpleGrid columns={[1, 2, 3]} gap={4} w="100%">
      {items.map((item: HospitalityItem) => (
        <HospitalityItemCard
          key={item.id}
          item={item}
          optionalFields={optionalFields}
        />
      ))}
    </SimpleGrid>
  );
}
