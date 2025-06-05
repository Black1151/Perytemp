"use client";

import {
  Box,
  Image,
  SimpleGrid,
  Text,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import CategoryItemCard from "./CategoryItemCard";
import ItemDetailModal from "./ItemDetailModal";

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

export function HospitalityHubMasonry() {
  const [selected, setSelected] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const handleItemClick = async (itemId: string) => {
    if (!selected) return;
    setModalOpen(true);
    setModalLoading(true);
    try {
      const res = await fetch(
        `/api/hospitality-hub/${selected.toLowerCase()}/${itemId}`
      );
      const data = await res.json();
      if (res.ok) {
        setSelectedItem(data.resource);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setModalLoading(false);
    }
  };

  useEffect(() => {
    if (!selected) return;
    const fetchItems = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/hospitality-hub/${selected.toLowerCase()}`
        );
        const data = await res.json();
        if (res.ok) {
          setItems(data.resource || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [selected]);

  if (selected) {
    if (loading) {
      return <Spinner />;
    }

    return (
      <Center>
        <Box
          mb={4}
          cursor="pointer"
          onClick={() => {
            setSelected(null);
            setItems([]);
          }}
        >
          <Text fontWeight="bold">&larr; Back</Text>
        </Box>
        <SimpleGrid columns={[1, 2, 3]} gap={4} w="100%">
          {items.map((item) => (
            <CategoryItemCard
              key={item.id || item.title}
              title={item.name || item.title}
              description={item.description}
              image={item.image}
              onClick={() => handleItemClick(item.id)}
            />
          ))}
        </SimpleGrid>
        <ItemDetailModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedItem(null);
          }}
          item={selectedItem}
          loading={modalLoading}
        />
      </Center>
    );
  }

  return (
    <SimpleGrid columns={[2, 3, 5]} gap={4} w="100%">
      {cards.map((card) => (
        <Box
          key={card.title}
          position="relative"
          h="700px"
          borderRadius="lg"
          overflow="hidden"
          role="group"
          cursor="pointer"
          onClick={() => setSelected(card.title)}
        >
          <Image
            src={card.image}
            alt={card.title}
            objectFit="cover"
            w="100%"
            h="100%"
          />
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
