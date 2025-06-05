"use client";

import { useEffect, useState } from "react";
import { PerygonTabs } from "../../../big-up/tabs/PerygonTabs";
import CategoryTabContent from "./CategoryTabContent";
import CategoryConfigForm from "./CategoryConfigForm";
import type { HospitalityHubCategory } from "../../hospitalityHubConfig";

export const HospitalityHubAdminClientInner = () => {
  const [categories, setCategories] = useState<HospitalityHubCategory[]>([]);

  const fetchCategories = async () => {
    const res = await fetch("/api/hospitality-hub/config");
    const data = await res.json();
    setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const tabsData = [
    {
      header: "Config",
      content: <CategoryConfigForm onAdd={fetchCategories} />,
    },
    ...categories.map((category) => ({
      header: category.displayName,
      content: <CategoryTabContent category={category} />,
    })),
  ];

  return <PerygonTabs tabs={tabsData} />;
};
