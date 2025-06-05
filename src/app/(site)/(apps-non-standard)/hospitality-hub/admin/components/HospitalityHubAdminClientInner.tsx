"use client";

import { PerygonTabs } from "../../../big-up/tabs/PerygonTabs";
import CategoryTabContent from "./CategoryTabContent";
import hospitalityHubConfig from "../hospitalityHubConfig";

export const HospitalityHubAdminClientInner = () => {
  const tabsData = hospitalityHubConfig.map((category) => ({
    header: category.title,
    content: <CategoryTabContent category={category} />,
  }));

  return <PerygonTabs tabs={tabsData} />;
};
