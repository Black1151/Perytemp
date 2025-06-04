"use client";

import React, { useState } from "react";
import { Box, Divider, Text, VStack, useTheme } from "@chakra-ui/react";
import Sidebar, { SidebarProps } from "../Sidebar";
import SideBarMenuItem from "@/components/Sidebars/NavigationSidebar/SideBarMenuItem";
import { DrawerStateOptions } from "@/components/Sidebars/useDrawerState";
import { useRouter } from "next/navigation";
import { Home } from "@mui/icons-material";

export interface MenuItem {
  label: string;
  icon: JSX.Element;
  onClick: () => void;
  category?: string;
  active?: boolean;
  locked?: boolean;
  badgeNumber?: number;
}

interface NavigationSidebarProps extends SidebarProps {
  menuItems: MenuItem[];
}

const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  menuItems,
  ...sidebarProps
}) => {
  const theme = useTheme();
  const router = useRouter();

  const [activeLabel, setActiveLabel] = useState<string | null>(null);

  const [drawerState, setDrawerState] = useState<DrawerStateOptions>(
    sidebarProps.drawerState ?? "closed"
  );
  const canHalf = true;
  const canFull = true;

  const onOpen = () => {
    if (canHalf) setDrawerState("half-open");
    else setDrawerState("fully-open");
  };
  const onToggle = () => {
    setDrawerState((curr) =>
      curr === "half-open" ? "fully-open" : "half-open"
    );
  };
  const onClose = () => {
    setDrawerState("closed");
  };

  const handleItemClick = (clicked: MenuItem) => {
    setActiveLabel(clicked.label);
    clicked.onClick?.();
  };

  const internalItems = menuItems;

  const groupedItems = internalItems.reduce(
    (acc, item) => {
      const cat = item.category || "uncategorized";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    },
    {} as Record<string, MenuItem[]>
  );

  const halfBarMenu = (
    <VStack spacing={0} pb={2} align="stretch" width="100%" justify={"space-between"} h={"full"}>
      <VStack spacing={0} align="stretch" width="100%">
        {Object.entries(groupedItems).map(([category, items], catIdx) => (
          <React.Fragment key={category}>
            {items.map((item, i) => (
              <React.Fragment key={item.label}>
                <SideBarMenuItem
                  label={item.label}
                  icon={item.icon}
                  showIconOnly={true}
                  iconSize={6}
                  isLeft={true}
                  active={item.active}
                  onClick={() => handleItemClick(item)}
                  locked={item.locked}
                  badgeNumber={item.badgeNumber}
                />
                {i < items.length - 1 && (
                  <Divider
                    borderColor={theme.colors.primary}
                    opacity={0.2}
                    my={2}
                  />
                )}
              </React.Fragment>
            ))}
            {catIdx < Object.keys(groupedItems).length - 1 && (
              <Divider
                borderColor={theme.colors.primary}
                opacity={0.8}
                my={6}
              />
            )}
          </React.Fragment>
        ))}
      </VStack>
      <SideBarMenuItem
        label={"My Tools"}
        icon={<Home />}
        showIconOnly={true}
        iconSize={6}
        isLeft={true}
        active={false}
        onClick={() => router.push("/")}
        locked={false}
      />
    </VStack>
  );

  const fullBarMenu = (
    <VStack spacing={0} pb={2} align="stretch" width="100%" justify={"space-between"} h={"full"}>
      <VStack spacing={0} align="stretch" pb={2}>
        {Object.entries(groupedItems).map(([category, items], catIdx) => (
          <React.Fragment key={category}>
            {category !== "uncategorized" && (
              <Box mb={2}>
                <Text
                  fontWeight="bold"
                  fontSize="md"
                  color={theme.colors.gray[600]}
                  mb={1}
                >
                  {category}
                </Text>
                <Divider borderColor={theme.colors.primary} opacity={0.5} />
              </Box>
            )}
            {items.map((item, i) => (
              <React.Fragment key={item.label}>
                <SideBarMenuItem
                  label={item.label}
                  icon={item.icon}
                  showIconOnly={false}
                  iconSize={6}
                  isLeft={true}
                  active={item.active}
                  onClick={() => handleItemClick(item)}
                  locked={item.locked}
                  badgeNumber={item.badgeNumber}
                />
                {i < items.length - 1 && (
                  <Divider
                    borderColor={theme.colors.primary}
                    opacity={0.2}
                    my={2}
                  />
                )}
              </React.Fragment>
            ))}
            {catIdx < Object.keys(groupedItems).length - 1 && (
              <Divider
                borderColor={theme.colors.primary}
                opacity={0.8}
                my={6}
              />
            )}
          </React.Fragment>
        ))}
      </VStack>
      <SideBarMenuItem
        label={"Home"}
        icon={<Home />}
        showIconOnly={true}
        iconSize={6}
        isLeft={true}
        active={false}
        onClick={() => router.push("/")}
        locked={false}
      />
    </VStack>
  );

  return (
    <Sidebar
      {...sidebarProps}
      drawerState={drawerState}
      canHalf={canHalf}
      canFull={canFull}
      onOpen={onOpen}
      onToggle={onToggle}
      onClose={onClose}
      halfOpenContent={halfBarMenu}
      fullyOpenContent={fullBarMenu}
    />
  );
};

export default NavigationSidebar;
