"use client";

import { useEffect, useState } from "react";
import { Button, VStack, Spinner, Select } from "@chakra-ui/react";
import { HospitalityCategory } from "@/types/hospitalityHub";
import useHospitalityCategories from "../../hooks/useHospitalityCategories";
import CategoryTabContent from "./CategoryTabContent";
import AddCategoryModal from "./AddCategoryModal";

export const HospitalityHubAdminClientInner = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { categories, loading, refresh } = useHospitalityCategories();
  const [selectedCategory, setSelectedCategory] = useState<HospitalityCategory | null>(null);

  useEffect(() => {
    if (!selectedCategory && categories.length > 0) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

  return (
    <VStack w="100%" spacing={4} align="stretch">
      <Button alignSelf="flex-end" onClick={() => setModalOpen(true)}>
        Add Category
      </Button>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Select
            value={selectedCategory?.id?.toString() || ""}
            onChange={(e) => {
              const value = e.target.value;
              const cat = categories.find((c) => String(c.id) === value);
              setSelectedCategory(cat || null);
            }}
            color="primaryTextColor"
            bg="elementBG"
            sx={{ option: { backgroundColor: "var(--chakra-colors-elementBG)" } }}
          >
            {categories.map((category) => (
              <option key={category.id} value={String(category.id)}>
                {category.name}
              </option>
            ))}
          </Select>
          {selectedCategory && <CategoryTabContent category={selectedCategory} />}
        </>
      )}
      <AddCategoryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={refresh}
      />
    </VStack>
  );
};
