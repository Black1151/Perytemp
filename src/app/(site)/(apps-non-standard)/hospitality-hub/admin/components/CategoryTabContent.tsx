"use client";

import { Spinner, VStack, Button, useToast } from "@chakra-ui/react";
import HospitalityItemsMasonry from "./HospitalityItemsMasonry";
import { HospitalityCategory, HospitalityItem } from "@/types/hospitalityHub";
import useHospitalityItems from "../../hooks/useHospitalityItems";
import { useState } from "react";
import AddItemModal from "./AddItemModal";
import DeleteItemModal from "./DeleteItemModal";

interface CategoryTabContentProps {
  category: HospitalityCategory;
}

export const CategoryTabContent = ({ category }: CategoryTabContentProps) => {
  const { items, loading, refresh } = useHospitalityItems(category.id);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<HospitalityItem | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<HospitalityItem | null>(
    null,
  );
  const toast = useToast();

  if (loading) {
    return <Spinner />;
  }

  return (
    <VStack w="100%" align="stretch" spacing={4}>
      <Button
        alignSelf="flex-end"
        onClick={() => {
          setEditingItem(null);
          setModalOpen(true);
        }}
      >
        Add Item
      </Button>
      {loading ? (
        <Spinner />
      ) : (
        <HospitalityItemsMasonry
          items={items}
          optionalFields={category.optionalFields || []}
          onEdit={(item) => {
            setEditingItem(item);
            setModalOpen(true);
          }}
          onDelete={(item) => {
            setDeletingItem(item);
            setDeleteOpen(true);
          }}
          onToggleActive={async (item) => {
            const res = await fetch("/api/hospitality-hub/items", {
              method: "PUT",
              body: JSON.stringify({ id: item.id, isActive: !item.isActive }),
            });
            const data = await res.json();
            if (!res.ok) {
              toast({
                title: data.error || "Failed to update item.",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-right",
              });
              return;
            }
            refresh();
          }}
        />
      )}
      <AddItemModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={refresh}
        categoryId={category.id}
        item={editingItem}
      />
      <DeleteItemModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        item={deletingItem}
        onDeleted={refresh}
      />
    </VStack>
  );
};

export default CategoryTabContent;
