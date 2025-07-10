// components/AdminTabList.tsx
"use client";
import { Tabs, TabList, useTheme } from "@chakra-ui/react";
import { transparentize } from "@chakra-ui/theme-tools";
import SettingsIcon from "@mui/icons-material/Settings";
import BarChartIcon from "@mui/icons-material/BarChart";
import { ConfirmationNumber } from "@mui/icons-material";
import React from "react";
import { AdminTabItem } from "./AdminTabItem";

interface AdminTabListProps {
  tabIndex: number;
  setTabIndex: (index: number) => void;
}

export const AdminTabList: React.FC<AdminTabListProps> = ({
  tabIndex,
  setTabIndex,
}) => {
  const theme = useTheme();
  return (
    <Tabs
      index={tabIndex}
      onChange={setTabIndex}
      mt={[2, 0]}
      alignSelf={["stretch", "stretch", "center"]}
    >
      <TabList
        bg={transparentize(theme.colors.elementBG, 0.5)(theme)}
        borderRadius="lg"
        boxShadow="sm"
        color="white"
        px={1}
        py={[1, 2]}
        mb={2}
        gap={2}
        w={["100%", "100%", "auto"]}
        justifyContent={["flex-start", "flex-start", "flex-end"]}
      >
        <AdminTabItem
          label="Management"
          icon={
            <SettingsIcon
              fontSize="small"
              style={{ marginRight: 2, fontSize: 16 }}
            />
          }
        />
        <AdminTabItem
          label="Analytics"
          icon={
            <BarChartIcon
              fontSize="small"
              style={{ marginRight: 2, fontSize: 16 }}
            />
          }
        />
        <AdminTabItem
          label="Bookings"
          icon={
            <ConfirmationNumber
              fontSize="small"
              style={{ marginRight: 2, fontSize: 16 }}
            />
          }
        />
      </TabList>
    </Tabs>
  );
};
