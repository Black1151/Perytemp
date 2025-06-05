"use client";

import { Box, Image, SimpleGrid, Text } from "@chakra-ui/react";

interface HubCard {
  title: string;
  image: string;
}

const cards: HubCard[] = [
  { title: "Hotels", image: "/big-up/big-up-app-bg.webp" },
  { title: "Rewards", image: "/carousel/enps-carousel-bg.webp" },
  { title: "Events", image: "/carousel/happiness-score-carousel-bg.webp" },
  { title: "Medical", image: "/carousel/business-score-carousel-bg.webp" },
  { title: "Legal", image: "/carousel/client-satisfaction-bg.webp" },
];

export default function HospitalityHubPage() {
  return (
    <SimpleGrid columns={[2, 3, 5]} gap={4} w="100%">
      {cards.map((card) => (
        <Box
          key={card.title}
          position="relative"
          h="150px"
          borderRadius="lg"
          overflow="hidden"
          role="group"
        >
          <Image src={card.image} alt={card.title} objectFit="cover" w="100%" h="100%" />
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
              {card.title}
            </Text>
          </Box>
        </Box>
      ))}
    </SimpleGrid>
  );
}
