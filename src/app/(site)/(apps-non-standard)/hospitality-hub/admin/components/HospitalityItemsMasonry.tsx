"use client";

import { Box, HStack, IconButton, SimpleGrid } from "@chakra-ui/react";
import HospitalityItemCard from "../../components/HospitalityItemCard";
import { HospitalityItem } from "@/types/hospitalityHub";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

interface HospitalityItemsMasonryProps {
  items: HospitalityItem[];
  optionalFields?: string[];
  onEdit?: (item: HospitalityItem) => void;
  onDelete?: (item: HospitalityItem) => void;
}

export default function HospitalityItemsMasonry({
  items,
  optionalFields = [],
  onEdit,
  onDelete,
}: HospitalityItemsMasonryProps) {
  return (
    <SimpleGrid columns={[1, 2, 3]} gap={4} w="100%">
      {items.map((item: HospitalityItem) => (
        <Box key={item.id} position="relative">
          <HospitalityItemCard
            item={item}
            optionalFields={optionalFields}
          />
          {(onEdit || onDelete) && (
            <HStack position="absolute" top={2} right={2} spacing={1}>
              {onEdit && (
                <IconButton
                  aria-label="Edit Item"
                  size="sm"
                  icon={<FiEdit2 />}
                  onClick={() => onEdit(item)}
                />
              )}
              {onDelete && (
                <IconButton
                  aria-label="Delete Item"
                  size="sm"
                  colorScheme="red"
                  icon={<FiTrash2 />}
                  onClick={() => onDelete(item)}
                />
              )}
            </HStack>
          )}
        </Box>
      ))}
    </SimpleGrid>
  );
}
