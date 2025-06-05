"use client";

import { useEffect, useState } from "react";
import { SimpleGrid, Spinner } from "@chakra-ui/react";
import HospitalityItemCard from "../../components/HospitalityItemCard";
import {
  HospitalityCategory,
  HospitalityItem,
} from "../../hospitalityHubConfig";

interface CategoryTabContentProps {
  category: HospitalityCategory;
}

export const CategoryTabContent = ({ category }: CategoryTabContentProps) => {
  const [items, setItems] = useState<HospitalityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/hospitality-hub/${category.key}`);
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
  }, [category]);

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
