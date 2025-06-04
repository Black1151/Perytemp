import React from "react";
import ToolDashboardLayout from "@/app/(site)/(apps)/ToolDashboardLayout";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ToolDashboardLayout toolUrl={"/happiness-score"} />
      {children}
    </>
  );
};

export default Layout;
