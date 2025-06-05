"use client";

import { VStack, Text, Image } from "@chakra-ui/react";
import PerygonCard from "@/components/layout/PerygonCard";

interface CategoryItemCardProps {
  title: string;
  description?: string;
  image?: string;
}

export function CategoryItemCard({ title, description, image }: CategoryItemCardProps) {
  return (
    <PerygonCard width="100%" height="100%" p={4} display="flex" flexDirection="column">
      {image && <Image src={image} alt={title} borderRadius="md" mb={2} />}
      <VStack align="start" spacing={1} flex={1}>
        <Text fontWeight="bold">{title}</Text>
        {description && <Text fontSize="sm">{description}</Text>}
      </VStack>
    </PerygonCard>
  );
}

export default CategoryItemCard;
