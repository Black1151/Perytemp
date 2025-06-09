"use client";

import {
  Box,
  Image,
  SimpleGrid,
  Text,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { useState } from "react";
import HospitalityItemCard from "../../components/HospitalityItemCard";
import ItemDetailModal from "./ItemDetailModal";
import { HospitalityItem } from '@/types/hospitalityHub';
import useHospitalityItems from "../../hooks/useHospitalityItems";
import useHospitalityCategories from "../../hooks/useHospitalityCategories";
// import hospitalityHubConfig, { HospitalityItem } from "../hospitalityHubConfig";

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
    setModalOpen(true);
    setModalLoading(true);
    try {
      const res = await fetch(`/api/hospitality-hub/${selected}/${itemId}`);
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

  // Items are fetched via useHospitalityItems when a category is selected

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
          }}
        >
          <Text fontWeight="bold">&larr; Back</Text>
        </Box>
        <SimpleGrid columns={[1, 2, 3]} gap={4} w="100%">
          {items.map((item) => (
            <HospitalityItemCard
              key={item.id}
              item={item}
              optionalFields={
                categories.find((c) => c.id === selected)?.optionalFields || []
              }
              onClick={() => handleItemClick(item.id)}
              showOverlay
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
          optionalFields={
            categories.find((c) => c.id === selected)?.optionalFields || []
          }
        />
      </Center>
    );
  }

  if (categoriesLoading) {
    return <Spinner />;
  }

  return (
    <SimpleGrid columns={[2, 3, 5]} gap={4} w="100%">
      {categories.map((category) => (
        <Box
          key={category.id}
          position="relative"
          h="700px"
          borderRadius="lg"
          overflow="hidden"
          role="group"
          cursor="pointer"
          onClick={() => setSelected(category.id)}
        >
          <Image
            src={category.image}
            alt={category.title}
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
              {category.title}
            </Text>
          </Box>
        </Box>
      ))}
    </SimpleGrid>
  );
}
