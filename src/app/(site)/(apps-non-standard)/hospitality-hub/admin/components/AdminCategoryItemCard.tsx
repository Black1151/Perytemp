"use client";
import { Box, VStack, Text, Image } from "@chakra-ui/react";
import PerygonCard from "@/components/layout/PerygonCard";
import { HospitalityItem } from "../../hospitalityHubConfig";

interface AdminCategoryItemCardProps {
  item: HospitalityItem;
  optionalFields: string[];
}

function formatLabel(label: string) {
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export default function AdminCategoryItemCard({ item, optionalFields }: AdminCategoryItemCardProps) {
  return (
    <PerygonCard width="100%" height="100%" p={4} display="flex" flexDirection="column">
      {item.image && <Image src={item.image} alt={item.name || item.title || ""} borderRadius="md" mb={2} />}
      <VStack align="start" spacing={1} flex={1}>
        <Text fontWeight="bold">{item.name || item.title}</Text>
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
  );
}
