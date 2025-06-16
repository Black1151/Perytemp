"use client";

import { Box, VStack, Text, Image } from "@chakra-ui/react";
import PerygonCard from "@/components/layout/PerygonCard";

interface ItemCardProps {
  title: string;
  description?: string;
  image?: string;
  onClick?: () => void;
}

export default function ItemCard({
  title,
  description,
  image,
  onClick,
}: ItemCardProps) {
  return (
    <Box
      position="relative"
      cursor={onClick ? "pointer" : undefined}
      onClick={onClick}
      h="100%"
      transition="transform 0.3s, box-shadow 0.3s"
      _hover={{ transform: "scale(1.05)", boxShadow: "2xl" }}
    >
      <PerygonCard
        width="100%"
        height="100%"
        p={4}
        display="flex"
        flexDirection="column"
      >
        {image && <Image src={image} alt={title} borderRadius="md" mb={2} />}
        <VStack align="start" spacing={1} flex={1}>
          <Text fontWeight="bold">{title}</Text>
          {description && <Text fontSize="sm">{description}</Text>}
        </VStack>
      </PerygonCard>
    </Box>
  );
}
