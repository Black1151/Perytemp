"use client";

import { useEffect, useState } from "react";
import { Button, VStack, Spinner } from "@chakra-ui/react";
import { PerygonTabs } from "../../../big-up/tabs/PerygonTabs";
import hospitalityHubConfig, {
  HospitalityCategory,
} from "../../hospitalityHubConfig";
import CategoryTabContent from "./CategoryTabContent";
import AddCategoryModal from "./AddCategoryModal";

export const HospitalityHubAdminClientInner = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [categories, setCategories] = useState<HospitalityCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/hospitality-hub/tabCategories");
      const data = await res.json();
      if (res.ok) {
        setCategories(data.resource || []);
      } else {
        setCategories(hospitalityHubConfig);
      }
    } catch (err) {
      console.error(err);
      setCategories(hospitalityHubConfig);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

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
        onCreated={fetchCategories}
      />
    </VStack>
  );
};
