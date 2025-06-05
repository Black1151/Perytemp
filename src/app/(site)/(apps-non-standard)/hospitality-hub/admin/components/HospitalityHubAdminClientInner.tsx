"use client";

import { PerygonTabs } from "../../../big-up/tabs/PerygonTabs";
import hospitalityHubConfig from "../../hospitalityHubConfig";
import CategoryTabContent from "./CategoryTabContent";

export const HospitalityHubAdminClientInner = () => {
  const tabsData = hospitalityHubConfig.map((category) => ({
    header: category.title,
    content: <CategoryTabContent category={category} />,
  }));

  return <PerygonTabs tabs={tabsData} />;
};
