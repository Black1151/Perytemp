import React from "react";
import MobilePopoutMenu from "../ContextualMenu";

export interface MenuItem {
  label: string;
  icon: JSX.Element;
  onClick: () => void;
  category?: string;
  active?: boolean;
  locked?: boolean;
  badgeNumber?: number;
}

interface NavigationMobilePopoutMenuProps {
  menuItems: MenuItem[];
}

const NavigationMobilePopoutMenu: React.FC<NavigationMobilePopoutMenuProps> = ({
  menuItems,
}) => {

  return (
    <MobilePopoutMenu
      menuItems={menuItems}
    />
  );
};

export default NavigationMobilePopoutMenu;
