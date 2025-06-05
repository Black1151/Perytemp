"use client";

import { PerygonTabs } from "../../../big-up/tabs/PerygonTabs";
import CategoryTabContent from "./CategoryTabContent";

const categories = ["Hotels", "Rewards", "Events", "Medical", "Legal"];

export const HospitalityHubAdminClientInner = () => {
  const tabsData = categories.map((category) => ({
    header: category,
    content: <CategoryTabContent category={category} />,
  }));

  return <PerygonTabs tabs={tabsData} />;
};
