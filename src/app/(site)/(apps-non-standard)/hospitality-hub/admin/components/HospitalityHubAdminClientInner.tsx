"use client";

import { useState } from "react";
import { Button, VStack, Spinner } from "@chakra-ui/react";
import { PerygonTabs } from "../../../big-up/tabs/PerygonTabs";
import { HospitalityCategory } from "@/types/hospitalityHub";
import useHospitalityCategories from "../../hooks/useHospitalityCategories";
import CategoryTabContent from "./CategoryTabContent";
import AddCategoryModal from "./AddCategoryModal";

export const HospitalityHubAdminClientInner = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { categories, loading, refresh } = useHospitalityCategories();

  const tabsData = categories.map((category) => ({
    header: category.title,
    content: <CategoryTabContent category={category} />,
  }));

  return (
    <VStack w="100%" spacing={4} align="stretch">
      <Button alignSelf="flex-end" onClick={() => setModalOpen(true)}>
        Add Category
      </Button>
      {loading ? <Spinner /> : <PerygonTabs tabs={tabsData} />}
      <AddCategoryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={refresh}
      />
    </VStack>
  );
};
