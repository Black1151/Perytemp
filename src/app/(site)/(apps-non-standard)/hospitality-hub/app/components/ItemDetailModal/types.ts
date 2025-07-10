import { HospitalityItem } from "@/types/hospitalityHub";
import React from "react";

/**
 * Props for the DetailsSection component, which displays detailed information about a hospitality item.
 */
export interface DetailsSectionProps {
  item: HospitalityItem;
  isPreview: boolean;
  handleCopy: (value: string) => void;
}

/**
 * Props for the LocationSection component, which displays the location and map for a hospitality item.
 */
export interface LocationSectionProps {
  item: HospitalityItem;
  mapLoading: boolean;
  setMapLoading: (loading: boolean) => void;
}

/**
 * Props for the BookingSection component, which displays the booking CTA and button for a hospitality item.
 */
export interface BookingSectionProps {
  ctaText: string;
  isPreview: boolean;
  item: HospitalityItem | null | undefined;
  setBookingOpen: (open: boolean) => void;
}

/**
 * Props for the ItemDetailModalHeader component, which displays the image, icon, title, description, and site names for a hospitality item.
 */
export interface ItemDetailModalHeaderProps {
  item?: HospitalityItem | null;
  isMobile: boolean | undefined;
  siteNames: string[];
  getMuiIconByName: (name: string) => React.ElementType | undefined;
}

/**
 * Represents a single tab or drawer item in the ItemDetailModal, including its label, content, and search label.
 */
export interface DrawerItem {
  id: string;
  label: string;
  content: React.ReactElement;
  searchableLabel: string;
}

/**
 * Props for the ItemDetailModalTabs component, which handles rendering and switching between modal tabs or drawers.
 */
export interface ItemDetailModalTabsProps {
  drawerItems: DrawerItem[];
  tabIndex: number;
  setTabIndex: (idx: number) => void;
  isMobile: boolean | undefined;
} 