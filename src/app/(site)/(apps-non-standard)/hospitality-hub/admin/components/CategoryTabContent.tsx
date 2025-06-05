"use client";

import { useEffect, useState } from "react";
import {
  SimpleGrid,
  Spinner,
  Button,
  Flex,
  useDisclosure,
} from "@chakra-ui/react";
import AdminCategoryItemCard from "./AdminCategoryItemCard";
import AddItemModal from "./AddItemModal";

interface CategoryTabContentProps {
  category: string;
}

export const CategoryTabContent = ({ category }: CategoryTabContentProps) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/hospitality-hub/${category.toLowerCase()}`);
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

  const handleAdd = (item: any) => {
    setItems((prev) => [...prev, item]);
  };

  return (
    <>
      <Flex justify="flex-end" mb={4}>
        <Button colorScheme="pink" onClick={onOpen}>
          Add
        </Button>
      </Flex>
      <AddItemModal
        isOpen={isOpen}
        onClose={onClose}
        category={category}
        onAdd={handleAdd}
      />
      <SimpleGrid columns={[1, 2, 3]} gap={4} w="100%">
        {items.map((item) => (
          <AdminCategoryItemCard
            key={item.id || item.name || item.provider}
            title={item.name || item.title || item.provider}
            description={item.description || item.speciality}
            image={item.image}
          />
        ))}
      </SimpleGrid>
    </>
  );
};

export default CategoryTabContent;
