"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import NavigationSidebar, {
  MenuItem,
} from "@/components/Sidebars/NavigationSidebar/NavigationSidebar";
import NavigationBottombar from "@/components/Bottombar/NavigationBottombar/NavigationBottombar";
import { useBasket, BasketItem, SubscriptionInfo } from "./useBasket";
import StorefrontIcon from "@mui/icons-material/Storefront";
import BuildIcon from "@mui/icons-material/Build";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import GroupIcon from "@mui/icons-material/Group";
import { Business, TipsAndUpdates } from "@mui/icons-material";
import ListAltIcon from '@mui/icons-material/ListAlt';
import { Phone } from "@mui/icons-material";
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import { useUser } from "@/providers/UserProvider";
import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

interface NavItem {
  label: string;
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & { muiName: string };
  href: string;
  badgeNumber?: number;
}

const Sidebars: React.FC = () => {
  const { basket } = useBasket();
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser();

  const basketCount =
    basket && basket.content && basket.ownedSubscriptionInfo
      ? basket.content.filter(
          (item: BasketItem) =>
            !basket.ownedSubscriptionInfo.some(
              (owned: SubscriptionInfo) => owned.uniqueId === item.toolConfigUniqueId
            )
        ).length
      : 0;

  const baseNavItems: NavItem[] = [
    { label: "Tool Store", icon: StorefrontIcon, href: "/tool-store" },
  ];

  const restrictedNavItems: NavItem[] = [
    {
      label: "Manage Subscription",
      icon: ShoppingCartIcon,
      href: "/tool-store/manage-subscription",
      badgeNumber: basketCount,
    },
    {
      label: "Current Subscription",
      icon: ListAltIcon,
      href: "/tool-store/my-subscription",
    },
    {
      label: "Contact Sales",
      icon: Phone,
      href: "/tool-store/contact-sales"
    },
    {
      label: "Additional Services",
      icon: DisplaySettingsIcon,
      href: "/tool-store/additional-services"
    },
    {
      label: "Feature Suggestions",
      icon: TipsAndUpdates,
      href: "/tool-store/feature-suggestions"
    }
  ];

  const navItems = [
    ...baseNavItems,
    ...(user?.role === "CA" || user?.role === "CL" ? [...restrictedNavItems] : [])
  ];

  const currentPath = pathname.replace(/\/$/, "");

  const menuItems: MenuItem[] = navItems.map((item) => ({
    label: item.label,
    icon: <item.icon sx={{ height: "100%", width: "100%" }} />,
    onClick: () => router.push(item.href),
    active: item.href.replace(/\/$/, "") === currentPath,
    badgeNumber: item.badgeNumber,
  }));

  return (
    <>
      <NavigationSidebar
        menuItems={menuItems}
        side="left"
        drawerState="half-open"
      />
      <NavigationBottombar menuItems={menuItems} />
    </>
  );
};

export default Sidebars;
