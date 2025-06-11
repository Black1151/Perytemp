"use client";

import { useEffect, useState } from "react";
import {
  VStack,
  Spinner,
  Select,
  IconButton,
  HStack,
  Tooltip,
  Switch,
} from "@chakra-ui/react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiToggleLeft,
  FiToggleRight,
} from "react-icons/fi";
import { HospitalityCategory } from "@/types/hospitalityHub";
import useHospitalityCategories from "../../hooks/useHospitalityCategories";
import CategoryTabContent from "./CategoryTabContent";
import AddCategoryModal from "./AddCategoryModal";
import DeleteCategoryModal from "./DeleteCategoryModal";

export const HospitalityHubAdminClientInner = () => {
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<HospitalityCategory | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const { categories, loading, refresh } = useHospitalityCategories();
  const [selectedCategory, setSelectedCategory] =
    useState<HospitalityCategory | null>(null);

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
              sx={{
                option: { backgroundColor: "var(--chakra-colors-elementBG)" },
              }}
            >
              {categories.map((category) => (
                <option key={category.id} value={String(category.id)}>
                  {category.name}
                </option>
              ))}
            </Select>
            <Tooltip label="Add Category">
              <IconButton
                aria-label="Add Category"
                icon={<FiPlus />}
                onClick={() => {
                  setEditingCategory(null);
                  setCategoryModalOpen(true);
                }}
                size="sm"
                colorScheme="green"
              />
            </Tooltip>
            <Tooltip label="Edit Category">
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
                colorScheme="blue"
              />
            </Tooltip>
            <Tooltip label="Delete Category">
              <IconButton
                aria-label="Delete Category"
                icon={<FiTrash2 />}
                onClick={() => setDeleteModalOpen(true)}
                size="sm"
                colorScheme="red"
                isDisabled={!selectedCategory}
              />
            </Tooltip>
            <Tooltip
              label={
                selectedCategory?.isActive
                  ? "Disable Category"
                  : "Enable Category"
              }
              shouldWrapChildren
            >
              <Switch
                aria-label={
                  selectedCategory?.isActive
                    ? "Disable Category"
                    : "Enable Category"
                }
                isChecked={selectedCategory?.isActive}
                onChange={async () => {
                  if (!selectedCategory) return;
                  const res = await fetch("/api/hospitality-hub/categories", {
                    method: "PUT",
                    body: JSON.stringify({
                      id: selectedCategory.id,
                      isActive: !selectedCategory.isActive,
                    }),
                  });
                  if (res.ok) {
                    refresh();
                    setSelectedCategory({
                      ...selectedCategory,
                      isActive: !selectedCategory.isActive,
                    });
                  }
                }}
                size="sm"
                isDisabled={!selectedCategory}
              />
            </Tooltip>
          </HStack>
          {selectedCategory && (
            <CategoryTabContent category={selectedCategory} />
          )}
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
