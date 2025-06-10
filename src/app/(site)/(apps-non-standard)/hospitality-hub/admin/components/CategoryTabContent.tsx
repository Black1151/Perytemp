"use client";

import { SimpleGrid, Spinner, VStack, Button } from "@chakra-ui/react";
import HospitalityItemCard from "../../components/HospitalityItemCard";
import { HospitalityCategory } from "@/types/hospitalityHub";
import useHospitalityItems from "../../hooks/useHospitalityItems";
import { useState } from "react";
import AddItemModal from "./AddItemModal";

interface CategoryTabContentProps {
  category: HospitalityCategory;
}

export const CategoryTabContent = ({ category }: CategoryTabContentProps) => {
  const { items, loading, refresh } = useHospitalityItems(category.id);
  const [modalOpen, setModalOpen] = useState(false);

  if (loading) {
    return <Spinner />;
  }

  return (
    <VStack w="100%" align="stretch" spacing={4}>
      <Button alignSelf="flex-end" onClick={() => setModalOpen(true)}>
        Add Item
      </Button>
      {loading ? (
        <Spinner />
      ) : (
        <SimpleGrid columns={[1, 2, 3]} gap={4} w="100%">
          {items.map((item) => (
            <HospitalityItemCard
              key={item.id}
              item={item}
              optionalFields={category.optionalFields || []}
            />
          ))}
        </SimpleGrid>
      )}
      <AddItemModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={refresh}
        categoryId={category.id}
      />
    </VStack>
  );
};

export default CategoryTabContent;
