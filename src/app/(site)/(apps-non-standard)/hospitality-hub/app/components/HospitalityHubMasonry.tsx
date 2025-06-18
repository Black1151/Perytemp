"use client";

import {
  Box,
  Image,
  SimpleGrid,
  Text,
  Spinner,
  Center,
} from "@chakra-ui/react";
import {
  AnimatedList,
  AnimatedListItem,
} from "@/components/animations/AnimatedList";
import { useState } from "react";

const preloadImage = (url: string) =>
  new Promise<void>((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = url;
  });

const preloadImages = (urls: string[]) =>
  Promise.all(urls.filter(Boolean).map(preloadImage));
import MasonryItemCard from "./MasonryItemCard";
import ItemDetailModal from "./ItemDetailModal";
import { HospitalityItem } from "@/types/hospitalityHub";
import useHospitalityItems from "../../hooks/useHospitalityItems";
import useHospitalityCategories from "../../hooks/useHospitalityCategories";

import { HospitalityCategory } from "@/types/hospitalityHub";

interface HospitalityHubMasonryProps {
  initialCategories?: HospitalityCategory[];
}

export function HospitalityHubMasonry({
  initialCategories = [],
}: HospitalityHubMasonryProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const { categories, loading: categoriesLoading } =
    useHospitalityCategories(initialCategories);
  const { items, loading } = useHospitalityItems(selected);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<HospitalityItem | null>(
    null
  );

  const handleItemClick = async (itemId: string) => {
    if (!selected) return;
    setModalLoading(true);
    try {
      const res = await fetch(`/api/hospitality-hub/items?id=${itemId}`);
      const data = await res.json();
      if (res.ok) {
        const item = data.resource;
        setSelectedItem(item);
        const urls: string[] = [];
        if (item.coverImageUrl) urls.push(item.coverImageUrl);
        if (item.logoImageUrl) urls.push(item.logoImageUrl);
        const additional = Array.isArray(item.additionalImageUrlList)
          ? item.additionalImageUrlList
          : typeof item.additionalImageUrlList === "string"
            ? item.additionalImageUrlList
                .split(',')
                .map((u: string) => u.trim())
                .filter(Boolean)
            : [];
        urls.push(...additional);
        await preloadImages(urls);
        setModalOpen(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setModalLoading(false);
    }
  };

  // Items are fetched via useHospitalityItems when a category is selected

  if (selected) {
    if (loading) {
      return <Spinner />;
    }

    return (
      <Center mt={20} mb={10}>
        <Box
          mb={4}
          cursor="pointer"
          onClick={() => {
            setSelected(null);
          }}
        >
          <Text fontWeight="bold">&larr; Back</Text>
        </Box>
        <SimpleGrid columns={[1, null, 2, 3]} gap={6} w="100%">
          <AnimatedList>
            {items.map((item, index) => (
              <AnimatedListItem key={item.id} index={index}>
                <MasonryItemCard
                  item={item}
                  onClick={() => handleItemClick(item.id)}
                />
              </AnimatedListItem>
            ))}
          </AnimatedList>
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

  if (categoriesLoading) {
    return <Spinner />;
  }

  return (
    <SimpleGrid columns={[2, 3, 5]} gap={4} w="100%">
      <AnimatedList>
        {categories.map((category, index) => (
          <AnimatedListItem key={category.id} index={index}>
            <Box
              position="relative"
              h="700px"
              borderRadius="lg"
              overflow="hidden"
              role="group"
              cursor="pointer"
              onClick={() => setSelected(category.id)}
              transition="transform 0.3s, box-shadow 0.3s"
              _hover={{ transform: "scale(1.05)", boxShadow: "2xl" }}
            >
              <Image
                src={category.imageUrl || (category as any).image}
                alt={category.name}
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
                display="flex"
                justifyContent="center"
                alignItems="center"
                pointerEvents="none"
                opacity={0}
                transition="opacity 0.3s"
                _groupHover={{ opacity: 1 }}
              >
                <Text color="white" fontWeight="bold" fontSize="xl">
                  {category.name}
                </Text>
              </Box>
            </Box>
          </AnimatedListItem>
        ))}
      </AnimatedList>
    </SimpleGrid>
  );
}
