"use client";

import { SimpleGrid, Spinner } from "@chakra-ui/react";
import HospitalityItemCard from "../../components/HospitalityItemCard";
import { HospitalityCategory } from "@/types/hospitalityHub";
import useHospitalityItems from "../../hooks/useHospitalityItems";

interface CategoryTabContentProps {
  category: HospitalityCategory;
}

export const CategoryTabContent = ({ category }: CategoryTabContentProps) => {
  const { items, loading } = useHospitalityItems(category.id);

  if (loading) {
    return <Spinner />;
  }

  return (
    <SimpleGrid columns={[1, 2, 3]} gap={4} w="100%">
      {items.map((item) => (
        <HospitalityItemCard
          key={item.id}
          item={item}
          optionalFields={category.optionalFields || []}
        />
      ))}
    </SimpleGrid>
  );
};

export default CategoryTabContent;
