"use client";

import { Spinner, VStack, Button } from "@chakra-ui/react";
import HospitalityItemsMasonry from "./HospitalityItemsMasonry";
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
        <HospitalityItemsMasonry
          items={items}
          optionalFields={category.optionalFields || []}
        />
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
