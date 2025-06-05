"use client";

import { Box, VStack, Text, Image } from "@chakra-ui/react";
import PerygonCard from "@/components/layout/PerygonCard";

interface CategoryItemCardProps {
  title: string;
  description?: string;
  image?: string;
  onClick?: () => void;
}

export function CategoryItemCard({ title, description, image, onClick }: CategoryItemCardProps) {
  return (
    <Box position="relative" role="group" cursor="pointer" onClick={onClick} h="100%">
      <PerygonCard width="100%" height="100%" p={4} display="flex" flexDirection="column">
        {image && <Image src={image} alt={title} borderRadius="md" mb={2} />}
        <VStack align="start" spacing={1} flex={1}>
          <Text fontWeight="bold">{title}</Text>
          {description && <Text fontSize="sm">{description}</Text>}
        </VStack>
      </PerygonCard>
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
          {title}
        </Text>
      </Box>
    </Box>
  );
}

export default CategoryItemCard;
