"use client";

import { Spinner, VStack, useToast } from "@chakra-ui/react";
import HospitalityItemsMasonry from "./HospitalityItemsMasonry";
import { HospitalityCategory, HospitalityItem } from "@/types/hospitalityHub";
import useHospitalityItems from "../../hooks/useHospitalityItems";
import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import AddItemModal from "./AddItemModal";
import DeleteItemModal from "./DeleteItemModal";

interface CategoryTabContentProps {
  category: HospitalityCategory;
}

export interface CategoryTabContentRef {
  openAddModal: () => void;
}
export const CategoryTabContent = forwardRef<
  CategoryTabContentRef,
  CategoryTabContentProps
>(({ category }, ref) => {
  const {
    items: fetchedItems,
    loading,
    refresh,
  } = useHospitalityItems(category.id);
  const [items, setItems] = useState<HospitalityItem[]>(fetchedItems);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<HospitalityItem | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<HospitalityItem | null>(
    null
  );
  const toast = useToast();

  useEffect(() => {
    setItems(fetchedItems);
  }, [fetchedItems]);

  const handleRefresh = async () => {
    await refresh();
  };

  useImperativeHandle(ref, () => ({
    openAddModal: () => {
      setEditingItem(null);
      setModalOpen(true);
    },
  }));

  if (loading && items.length === 0) {
    return <Spinner />;
  }

  return (
    <VStack w="100%" align="stretch" spacing={4}>
      {loading && items.length > 0 && <Spinner size="sm" alignSelf="center" />}
      {loading && items.length === 0 ? (
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
            toast({
              title: "Item updated successfully.",
              status: "success",
              duration: 5000,
              isClosable: true,
              position: "bottom-right",
            });
            setItems((prev) =>
              prev.map((i) =>
                i.id === item.id ? { ...i, isActive: !i.isActive } : i
              )
            );
          }}
        />
      )}
      <AddItemModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={handleRefresh}
        categoryId={category.id}
        catOwnerUserId={category.catOwnerUserId}
        item={editingItem}
      />
      <DeleteItemModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        item={deletingItem}
        onDeleted={handleRefresh}
      />
    </VStack>
  );
});

export default CategoryTabContent;
