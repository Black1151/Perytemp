"use client";

import { useEffect, useState } from "react";
import {
  VStack,
  Spinner,
  Select,
  IconButton,
  HStack,
} from "@chakra-ui/react";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { HospitalityCategory } from "@/types/hospitalityHub";
import useHospitalityCategories from "../../hooks/useHospitalityCategories";
import CategoryTabContent from "./CategoryTabContent";
import AddCategoryModal from "./AddCategoryModal";
import DeleteCategoryModal from "./DeleteCategoryModal";

export const HospitalityHubAdminClientInner = () => {
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<HospitalityCategory | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const { categories, loading, refresh } = useHospitalityCategories();
  const [selectedCategory, setSelectedCategory] = useState<HospitalityCategory | null>(null);

  useEffect(() => {
    if (!selectedCategory && categories.length > 0) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

  return (
    <VStack w="100%" spacing={4} align="stretch">
      {loading ? (
        <Spinner />
      ) : (
        <>
          <HStack>
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
            <IconButton
              aria-label="Add Category"
              icon={<FiPlus />}
              onClick={() => {
                setEditingCategory(null);
                setCategoryModalOpen(true);
              }}
              size="sm"
            />
            <IconButton
              aria-label="Edit Category"
              icon={<FiEdit2 />}
              onClick={() => {
                if (selectedCategory) {
                  setEditingCategory(selectedCategory);
                  setCategoryModalOpen(true);
                }
              }}
              size="sm"
              isDisabled={!selectedCategory}
            />
            <IconButton
              aria-label="Delete Category"
              icon={<FiTrash2 />}
              onClick={() => setDeleteModalOpen(true)}
              size="sm"
              colorScheme="red"
              isDisabled={!selectedCategory}
            />
          </HStack>
          {selectedCategory && <CategoryTabContent category={selectedCategory} />}
        </>
      )}
      <AddCategoryModal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        onCreated={refresh}
        category={editingCategory}
      />
      <DeleteCategoryModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        category={selectedCategory}
        onDeleted={refresh}
      />
    </VStack>
  );
};
