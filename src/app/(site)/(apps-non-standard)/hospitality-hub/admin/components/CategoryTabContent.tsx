"use client";

import { SimpleGrid, Spinner } from "@chakra-ui/react";
import useHospitalityItems from "../../hooks/useHospitalityItems";
import HospitalityItemCard from "../../components/HospitalityItemCard";
import {
  HospitalityCategory,
} from "../../hospitalityHubConfig";

interface CategoryTabContentProps {
  category: HospitalityCategory;
}

export const CategoryTabContent = ({ category }: CategoryTabContentProps) => {
  const { items, loading } = useHospitalityItems(category.key);

  if (loading) {
    return <Spinner />;
  }

  return (
    <SimpleGrid columns={[1, 2, 3]} gap={4} w="100%">
      {items.map((item) => (
        <HospitalityItemCard
          key={item.id}
          item={item}
          optionalFields={category.optionalFields}
        />
      ))}
    </SimpleGrid>
  );
};

export default CategoryTabContent;
