"use client";

import { PerygonTabs } from "../../big-up/tabs/PerygonTabs";

const categories = ["Hotels", "Rewards", "Events", "Medical", "Legal"];

export const HospitalityHubAdminClientInner = () => {
  const tabsData = categories.map((category) => ({
    header: category,
    content: <></>,
  }));

  return <PerygonTabs tabs={tabsData} />;
};
