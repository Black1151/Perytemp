"use client";

import { useState } from "react";
import { Button, VStack } from "@chakra-ui/react";
import { PerygonTabs } from "../../../big-up/tabs/PerygonTabs";
import hospitalityHubConfig from "../../hospitalityHubConfig";
import CategoryTabContent from "./CategoryTabContent";
import AddCategoryModal from "./AddCategoryModal";

export const HospitalityHubAdminClientInner = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const tabsData = hospitalityHubConfig.map((category) => ({
    header: category.title,
    content: <CategoryTabContent category={category} />,
  }));

  return (
    <VStack w="100%" spacing={4} align="stretch">
      <Button alignSelf="flex-end" onClick={() => setModalOpen(true)}>
        Add Category
      </Button>
      <PerygonTabs tabs={tabsData} />
      <AddCategoryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={() => {}}
      />
    </VStack>
  );
};
