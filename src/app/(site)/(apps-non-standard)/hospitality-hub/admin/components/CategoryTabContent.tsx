"use client";

import { useEffect, useState } from "react";
import { SimpleGrid, Spinner } from "@chakra-ui/react";
import ItemCard from "../../components/ItemCard";
import type { HospitalityHubCategory } from "../../hospitalityHubConfig";

interface CategoryTabContentProps {
  category: HospitalityHubCategory;
}

export const CategoryTabContent = ({ category }: CategoryTabContentProps) => {
  const [items, setItems] = useState<any[]>([]);
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
        <ItemCard
          key={item.id || item.name || item.provider}
          title={item.name || item.title || item.provider}
          description={item.description || item.speciality}
          image={item.image}
        />
      ))}
    </SimpleGrid>
  );
};

export default CategoryTabContent;
